/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface PersonaInterface extends ethers.utils.Interface {
  functions: {
    "setBgp(address,tuple)": FunctionFragment;
    "setMeta(address,bytes)": FunctionFragment;
    "setPfa(address,string)": FunctionFragment;
    "setPfp(address,tuple)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "setBgp",
    values: [string, { contractAddress: string; tokenId: BigNumberish }]
  ): string;
  encodeFunctionData(
    functionFragment: "setMeta",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setPfa",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPfp",
    values: [string, { contractAddress: string; tokenId: BigNumberish }]
  ): string;

  decodeFunctionResult(functionFragment: "setBgp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setMeta", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPfa", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPfp", data: BytesLike): Result;

  events: {
    "SetBgp(address,address,tuple)": EventFragment;
    "SetMeta(address,address,bytes)": EventFragment;
    "SetPfa(address,address,string)": EventFragment;
    "SetPfp(address,address,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetBgp"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetMeta"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetPfa"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetPfp"): EventFragment;
}

export class Persona extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: PersonaInterface;

  functions: {
    setBgp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setBgp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setMeta(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMeta(address,bytes)"(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setPfa(
      app: string,
      pfa: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setPfa(address,string)"(
      app: string,
      pfa: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setPfp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setPfp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  setBgp(
    app: string,
    token: { contractAddress: string; tokenId: BigNumberish },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setBgp(address,tuple)"(
    app: string,
    token: { contractAddress: string; tokenId: BigNumberish },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setMeta(
    app: string,
    meta: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMeta(address,bytes)"(
    app: string,
    meta: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setPfa(
    app: string,
    pfa: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setPfa(address,string)"(
    app: string,
    pfa: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setPfp(
    app: string,
    token: { contractAddress: string; tokenId: BigNumberish },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setPfp(address,tuple)"(
    app: string,
    token: { contractAddress: string; tokenId: BigNumberish },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    setBgp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;

    "setBgp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;

    setMeta(
      app: string,
      meta: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "setMeta(address,bytes)"(
      app: string,
      meta: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setPfa(app: string, pfa: string, overrides?: CallOverrides): Promise<void>;

    "setPfa(address,string)"(
      app: string,
      pfa: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPfp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;

    "setPfp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    SetBgp(
      account: string | null,
      app: string | null,
      token: null
    ): EventFilter;

    SetMeta(
      account: string | null,
      app: string | null,
      meta: null
    ): EventFilter;

    SetPfa(account: string | null, app: string | null, pfa: null): EventFilter;

    SetPfp(
      account: string | null,
      app: string | null,
      token: null
    ): EventFilter;
  };

  estimateGas: {
    setBgp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setBgp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<BigNumber>;

    setMeta(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setMeta(address,bytes)"(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setPfa(app: string, pfa: string, overrides?: Overrides): Promise<BigNumber>;

    "setPfa(address,string)"(
      app: string,
      pfa: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setPfp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setPfp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    setBgp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setBgp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setMeta(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMeta(address,bytes)"(
      app: string,
      meta: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setPfa(
      app: string,
      pfa: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setPfa(address,string)"(
      app: string,
      pfa: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setPfp(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setPfp(address,tuple)"(
      app: string,
      token: { contractAddress: string; tokenId: BigNumberish },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
