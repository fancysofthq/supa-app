import Dexie, { type Transaction } from "dexie";
import { ethers } from "ethers";

export async function syncEvents<DB extends Dexie, Event, EventIterReturnT>(
  db: DB,
  eventTable: Dexie.Table<Event, any>,
  txTables: Dexie.Table<any, any>[],
  since: number,
  until: number,
  cancel: () => boolean,
  contract: ethers.Contract,
  filter: ethers.EventFilter,
  rawEventMap: (e: ethers.Event) => Event[],
  eventIter?: (e: Event) => Promise<EventIterReturnT>,
  txEventIter?: (
    tx: Transaction,
    e: Event,
    i: EventIterReturnT | undefined
  ) => Promise<void>
) {
  await Promise.all([
    syncPastEvents(
      db,
      eventTable,
      txTables,
      since,
      until,
      cancel,
      contract,
      filter,
      rawEventMap,
      eventIter,
      txEventIter
    ),
    subscribeToNewEvents(
      db,
      eventTable,
      txTables,
      until,
      cancel,
      contract,
      filter,
      rawEventMap,
      eventIter,
      txEventIter
    ),
  ]);
}

/**
 * Synchronize past events.
 *
 * @param rawEventMap Must be synchronous.
 * @param until The block to sync until (including).
 */
async function syncPastEvents<DB extends Dexie, Event, EventIterReturnT>(
  db: DB,
  eventTable: Dexie.Table<Event, any>,
  txTables: Dexie.Table<any, any>[],
  since: number,
  until: number,
  cancel: () => boolean,
  contract: ethers.Contract,
  filter: ethers.EventFilter,
  rawEventMap: (e: ethers.Event) => Event[],
  eventIter?: (e: Event) => Promise<EventIterReturnT>,
  txEventIter?: (
    tx: Transaction,
    e: Event,
    i: EventIterReturnT | undefined
  ) => Promise<void>
) {
  let fromBlock =
    (await db.table(eventTable.name).toCollection().last())?.blockNumber ||
    since;

  fromBlock = Math.max(fromBlock, since);

  while (fromBlock < until && !cancel()) {
    const toBlock = Math.min(until, fromBlock + 100);

    const rawEvents = await contract.queryFilter(filter, fromBlock, toBlock);
    const mappedEvents = rawEvents.flatMap(rawEventMap);

    const iterResults = await Promise.all(
      mappedEvents.map((e) => eventIter?.(e))
    );

    await db.transaction("rw", txTables, async (tx) => {
      let latestEvent = await tx.table(eventTable.name).toCollection().last();
      const latestBlock = latestEvent?.blockNumber || 0;

      if (latestBlock <= fromBlock) {
        await tx.table(eventTable.name).bulkPut(mappedEvents);

        if (txEventIter) {
          for (let i = 0; i < mappedEvents.length; i++) {
            await txEventIter(tx, mappedEvents[i], iterResults[i]);
          }
        }
      }
    });

    fromBlock = toBlock + 1;
  }
}

/**
 * Subscribe to new events.
 *
 * @param filter Event filter.
 * @param rawEventMap Synchronous function to map raw event to a typed event.
 * @param eventIter Iterate over typed events to get some data to be stored in the transaction.
 * It may be undefined if there is no any out-of-database interaction needed.
 * @param txEventIter Iterate over typed events and the data in the same transaction.
 * Keep in mind that an IndexedDB transaction would commit as soon as it has nothing to do.
 */
async function subscribeToNewEvents<DB extends Dexie, Event, EventIterReturnT>(
  db: DB,
  eventTable: Dexie.Table<Event, any>,
  txTables: Dexie.Table<any, any>[],
  until: number,
  cancel: () => boolean,
  contract: ethers.Contract,
  filter: ethers.EventFilter,
  rawEventMap: (e: ethers.Event) => Event[],
  eventIter?: (e: Event) => Promise<EventIterReturnT>,
  txEventIter?: (
    tx: Transaction,
    e: Event,
    i: EventIterReturnT | undefined
  ) => Promise<void>
) {
  contract.on(filter, async (...data) => {
    if (cancel()) {
      contract.removeAllListeners(filter);
      return;
    }

    const e = data[data.length - 1];

    // We've already synchronized this event.
    if (e.blockNumber <= until) return;

    const mappedEvents = rawEventMap(e);

    if (mappedEvents.length > 0) {
      const iterResults = await Promise.all(
        mappedEvents.map((e) => eventIter?.(e))
      );

      await db.transaction("rw", txTables, async (tx) => {
        let latestEvent = await tx.table(eventTable.name).toCollection().last();
        const latestBlock = latestEvent?.blockNumber || 0;

        if (latestBlock <= e.blockNumber) {
          await tx.table(eventTable.name).bulkPut(mappedEvents);

          if (txEventIter) {
            for (let i = 0; i < mappedEvents.length; i++) {
              await txEventIter(tx, mappedEvents[i], iterResults[i]);
            }
          }
        }
      });
    }
  });
}
