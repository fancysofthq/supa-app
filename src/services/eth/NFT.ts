import { BigNumber } from "ethers";
import { Address } from "./Address";

export type NFT = {
  contract: Address;
  id: BigNumber;
};
