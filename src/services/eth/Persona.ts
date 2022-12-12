import Dexie, { type Table } from "dexie";
import { ethers } from "ethers";
import { ref, type Ref } from "vue";
import { Address } from "./Address";
import { type NFT } from "./NFT";
import { Persona as PersonaContact } from "./contracts/Persona";
import { PersonaFactory } from "./contracts/PersonaFactory";
import { invalidatePfpCache } from "../../components/PFP.vue";
import { syncEvents } from "./db";

export type Persona = {
  account: string;
  pfp?: NFT;
  bgp?: NFT;
  pfa?: string;
  meta?: any;
};

type Base = { account: string };

/**
 * ```solidity
 * /// Emitted when {account} sets its per-application PFP (ProFile Picture).
 * /// It's up to the client to check the NFT ownership dynamically.
 * event SetPfp(address indexed account, address indexed app, NFT token);
 * ```
 */
type SetPfp = Base & {
  token: NFT;
};

/**
 * ```solidity
 * /// Emitted when {account} sets its per-application BGP (BackGround Picture).
 * /// It's up to the client to check the NFT ownership dynamically.
 * event SetBgp(address indexed account, address indexed app, NFT token);
 * ```
 */
type SetBgp = SetPfp;

/**
 * ```solidity
 * /// Emitted when an {account} sets its per-application PFA (ProFile About).
 * event SetPfa(address indexed account, address indexed app, string pfa);
 * ```
 */
type SetPfa = Base & {
  pfa: string;
};

/**
 * ```solidity
 * /// Emitted when an {account} sets its per-application CBOR-encoded meta.
 * event SetMeta(address indexed account, address indexed app, bytes meta);
 * ```
 */
type SetMeta = Base & {
  meta: string;
};

export class PersonaDB extends Dexie {
  personas!: Table<Persona, string>;
  setPfp!: Table<SetPfp, string>;
  setBgp!: Table<SetBgp, string>;
  setPfa!: Table<SetPfa, string>;
  setMeta!: Table<SetMeta, string>;

  public readonly contract: PersonaContact;
  readonly lastSyncedBlockKey: string;

  constructor(
    provider: ethers.providers.Provider,
    readonly chainId: number,
    contractAddress: Address,
    readonly appAddress: Address
  ) {
    super(
      `eth-persona:${chainId}:${contractAddress.toString()}:${appAddress.toString()}`
    );

    this.version(1).stores({
      personas: "account",
      setPfp: "account",
      setBgp: "account",
      setPfa: "account",
      setMeta: "account",
    });

    this.contract = PersonaFactory.connect(
      contractAddress.toString(),
      provider
    );

    this.lastSyncedBlockKey = `persona:${this.chainId}:${this.contract.address}:${this.appAddress}.lastSyncedBlock`;
  }

  async sync(cancel: () => boolean) {
    const genesisBlock = await this.contract.deployedBlock();
    const untilBlock = await this.contract.provider.getBlockNumber();

    this.syncSetPfp(genesisBlock, untilBlock, cancel);
    this.syncSetBgp(genesisBlock, untilBlock, cancel);
    this.syncSetPfa(genesisBlock, untilBlock, cancel);
    this.syncSetMeta(genesisBlock, untilBlock, cancel);
  }

  private async syncSetPfp(
    genesisBlock: number,
    untilBlock: number,
    cancel: () => boolean
  ) {
    syncEvents(
      this,
      this.setPfp,
      [this.setPfp, this.personas],
      genesisBlock,
      untilBlock,
      cancel,
      this.contract,
      this.contract.filters.SetPfp(null, this.appAddress.toString(), null),
      (e): SetPfp[] => [
        {
          account: e.args!.account,
          token: {
            contract: e.args!.token.contractAddress,
            id: e.args!.token.tokenId,
          },
        },
      ],
      undefined,
      async (tx, e) => {
        const persona = (await tx.table(this.personas.name).get(e.account)) || {
          account: e.account,
        };

        persona.pfp = e.token;
        invalidatePfpCache(new Address(e.account));

        tx.table(this.personas.name).put(persona);
      }
    );
  }

  private async syncSetBgp(
    genesisBlock: number,
    untilBlock: number,
    cancel: () => boolean
  ) {
    syncEvents(
      this,
      this.setBgp,
      [this.setBgp, this.personas],
      genesisBlock,
      untilBlock,
      cancel,
      this.contract,
      this.contract.filters.SetBgp(null, this.appAddress.toString(), null),
      (e): SetBgp[] => [
        {
          account: e.args!.account,
          token: {
            contract: e.args!.token.contractAddress,
            id: e.args!.token.tokenId,
          },
        },
      ],
      undefined,
      async (tx, e) => {
        const persona = (await tx.table(this.personas.name).get(e.account)) || {
          account: e.account,
        };

        persona.bgp = e.token;

        tx.table(this.personas.name).put(persona);
      }
    );
  }

  private async syncSetPfa(
    genesisBlock: number,
    untilBlock: number,
    cancel: () => boolean
  ) {
    syncEvents(
      this,
      this.setPfa,
      [this.setPfa, this.personas],
      genesisBlock,
      untilBlock,
      cancel,
      this.contract,
      this.contract.filters.SetPfa(null, this.appAddress.toString(), null),
      (e): SetPfa[] => [
        {
          account: e.args!.account,
          pfa: e.args!.pfa,
        },
      ],
      undefined,
      async (tx, e) => {
        const persona = (await tx.table(this.personas.name).get(e.account)) || {
          account: e.account,
        };

        persona.pfa = e.pfa;

        tx.table(this.personas.name).put(persona);
      }
    );
  }

  private async syncSetMeta(
    genesisBlock: number,
    untilBlock: number,
    cancel: () => boolean
  ) {
    syncEvents(
      this,
      this.setMeta,
      [this.setMeta, this.personas],
      genesisBlock,
      untilBlock,
      cancel,
      this.contract,
      this.contract.filters.SetMeta(null, this.appAddress.toString(), null),
      (e): SetMeta[] => [
        {
          account: e.args!.account,
          meta: e.args!.meta,
        },
      ],
      undefined,
      async (tx, e) => {
        const persona = (await tx.table(this.personas.name).get(e.account)) || {
          account: e.account,
        };

        persona.meta = e.meta;

        tx.table(this.personas.name).put(persona);
      }
    );
  }
}

let db: Ref<PersonaDB | undefined> = ref(undefined);

export function usePersona() {
  const init = async (
    provider: ethers.providers.Provider,
    personaContract: Address,
    appAddress: Address,
    cancel: () => boolean
  ) => {
    db.value = new PersonaDB(
      provider,
      (await provider.getNetwork()).chainId,
      personaContract,
      appAddress
    );

    await db.value.sync(cancel);
  };

  return { db, init };
}
