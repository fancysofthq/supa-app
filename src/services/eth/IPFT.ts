import { CID } from "multiformats";
import { Buffer } from "buffer";
import * as MultihashDigest from "multiformats/hashes/digest";
import { keccak256 } from "@multiformats/sha3";
import * as DagCbor from "@ipld/dag-cbor";
import { BigNumber } from "ethers";
import { hex2Bytes } from "../../utils/hex";
import { Address } from "./Address";

export function cidToUint256(cid: CID): BigNumber {
  if (cid.multihash.size > 32) throw new Error("CID multihash is too big");
  if (cid.multihash.digest.every((b) => b == 0))
    throw new Error("CID multihash is all zeros");

  return BigNumber.from(cid.multihash.digest);
}

export function uint256ToCID(
  id: BigNumber,
  contentCodec: number = DagCbor.code,
  hashCodec: number = keccak256.code
): CID {
  const bytes = hex2Bytes(id._hex.padEnd(66, "0").slice(2));
  const digest = MultihashDigest.create(hashCodec, bytes);
  return CID.createV1(contentCodec, digest);
}

export class Tag {
  constructor(
    public readonly chainId: number,
    public readonly contract: Address,
    public readonly author: Address
  ) {}

  toBytes(): Uint8Array {
    const tag = Buffer.alloc(56);

    tag.writeUint32BE(0x69706674); // "ipft"
    tag.writeUint32BE(0x0165766d, 4); // "\x{01}evm"
    tag.write(this.chainId.toString(16).padStart(16, "0"), 8, 8, "hex");
    tag.write(this.contract.toString().slice(2), 16, 20, "hex");
    tag.write(this.author.toString().slice(2), 36, 20, "hex");

    return tag;
  }
}

export function metadataUri(cid: CID): URL {
  return new URL("http://" + cid.toString() + ".ipfs/metadata.json");
}
