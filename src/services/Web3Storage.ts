import { keccak256 } from "@multiformats/sha3";
import { sha256 } from "multiformats/hashes/sha2";
import { Block, encode as encodeBlock } from "multiformats/block";
import * as raw from "multiformats/codecs/raw";
import * as dagCbor from "@ipld/dag-cbor";
import { CarReader } from "@ipld/car";
import * as IPFT from "./eth/IPFT";
import { Version } from "multiformats/cid";

export class Blockstore {
  constructor(
    public readonly root: Block<unknown, number, number, Version>,
    public readonly blocks: Block<unknown, number, number, Version>[]
  ) {}

  toCar(): CarReader {
    return new CarReader(
      {
        version: 1,
        roots: [this.root.cid],
      },
      [this.root, ...this.blocks]
    );
  }
}

export interface Blockifiable {
  /**
   * Blockify a structured object into an IPLD block,
   * also returning a JSON with substituted CIDs.
   */
  blockify(): Promise<{
    json: any;
    block: Block<unknown, number, number, 1>;
  }>;
}

/**
 *
 * @param token A rich token metadata object with `File` objects in it.
 */
export async function packIpft(
  token: Blockifiable,
  ipftTag: IPFT.Tag
): Promise<Blockstore> {
  // 1. Block-ify the token.
  const { json: metadataJSON, block: metadataRootBlock } =
    await token.blockify();

  // 2. Encode the JSON metadata.
  const metadataJSONFile = await encodeBlock({
    value: new TextEncoder().encode(JSON.stringify(metadataJSON)),
    codec: raw,
    hasher: sha256,
  });

  // 3. Encode the root CBOR.
  const root = await encodeBlock({
    value: {
      root: metadataRootBlock.cid,
      "metadata.json": metadataJSONFile.cid,
      ipft: ipftTag.toBytes(),
    },
    codec: dagCbor,
    hasher: keccak256,
  });

  return new Blockstore(
    new Block({
      cid: root.cid,
      bytes: root.bytes,
      value: root.value,
    }),
    [
      new Block({
        cid: metadataJSONFile.cid,
        bytes: metadataJSONFile.bytes,
        value: metadataJSONFile.value,
      }),
      metadataRootBlock,
    ]
  );
}
