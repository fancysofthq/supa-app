/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Persona } from "./Persona";

export class PersonaFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Persona> {
    return super.deploy(overrides || {}) as Promise<Persona>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Persona {
    return super.attach(address) as Persona;
  }
  connect(signer: Signer): PersonaFactory {
    return super.connect(signer) as PersonaFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Persona {
    return new Contract(address, _abi, signerOrProvider) as Persona;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Persona.NFT",
        name: "token",
        type: "tuple",
      },
    ],
    name: "SetBgp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "meta",
        type: "bytes",
      },
    ],
    name: "SetMeta",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pfa",
        type: "string",
      },
    ],
    name: "SetPfa",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Persona.NFT",
        name: "token",
        type: "tuple",
      },
    ],
    name: "SetPfp",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        internalType: "struct Persona.NFT",
        name: "token",
        type: "tuple",
      },
    ],
    name: "setBgp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "meta",
        type: "bytes",
      },
    ],
    name: "setMeta",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        internalType: "string",
        name: "pfa",
        type: "string",
      },
    ],
    name: "setPfa",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "app",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        internalType: "struct Persona.NFT",
        name: "token",
        type: "tuple",
      },
    ],
    name: "setPfp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506106a8806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633e04483a1461005157806397ae2f921461006d578063eb8562a414610089578063fc5a1f55146100a5575b600080fd5b61006b60048036038101906100669190610338565b6100c1565b005b610087600480360381019061008291906103bc565b61012d565b005b6100a3600480360381019061009e9190610452565b610196565b005b6100bf60048036038101906100ba91906103bc565b610202565b005b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f3b0d092474e9e27d8bb02dc21baf50b995d6d6dba8d2e12fab5febb760ecd92f8484604051610120929190610510565b60405180910390a3505050565b8173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167ff7d1bd65e2255f8f66f8e6f1075f11f254d3c790f9a074364d33fff5803ad0728360405161018a91906105f5565b60405180910390a35050565b8273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f61b18a2c665acb0478e13099516d6db506308cabc9cfe0c20df781dd7b06b87784846040516101f592919061064e565b60405180910390a3505050565b8173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f4309d7d7277243264617d0ca617299549282a515c51bd2b1886bec8fc5f3158a8360405161025f91906105f5565b60405180910390a35050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102a082610275565b9050919050565b6102b081610295565b81146102bb57600080fd5b50565b6000813590506102cd816102a7565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126102f8576102f76102d3565b5b8235905067ffffffffffffffff811115610315576103146102d8565b5b602083019150836001820283011115610331576103306102dd565b5b9250929050565b6000806000604084860312156103515761035061026b565b5b600061035f868287016102be565b935050602084013567ffffffffffffffff8111156103805761037f610270565b5b61038c868287016102e2565b92509250509250925092565b600080fd5b6000604082840312156103b3576103b2610398565b5b81905092915050565b600080606083850312156103d3576103d261026b565b5b60006103e1858286016102be565b92505060206103f28582860161039d565b9150509250929050565b60008083601f840112610412576104116102d3565b5b8235905067ffffffffffffffff81111561042f5761042e6102d8565b5b60208301915083600182028301111561044b5761044a6102dd565b5b9250929050565b60008060006040848603121561046b5761046a61026b565b5b6000610479868287016102be565b935050602084013567ffffffffffffffff81111561049a57610499610270565b5b6104a6868287016103fc565b92509250509250925092565b600082825260208201905092915050565b82818337600083830152505050565b6000601f19601f8301169050919050565b60006104ef83856104b2565b93506104fc8385846104c3565b610505836104d2565b840190509392505050565b6000602082019050818103600083015261052b8184866104e3565b90509392505050565b600061054360208401846102be565b905092915050565b61055481610295565b82525050565b6000819050919050565b61056d8161055a565b811461057857600080fd5b50565b60008135905061058a81610564565b92915050565b600061059f602084018461057b565b905092915050565b6105b08161055a565b82525050565b604082016105c76000830183610534565b6105d4600085018261054b565b506105e26020830183610590565b6105ef60208501826105a7565b50505050565b600060408201905061060a60008301846105b6565b92915050565b600082825260208201905092915050565b600061062d8385610610565b935061063a8385846104c3565b610643836104d2565b840190509392505050565b60006020820190508181036000830152610669818486610621565b9050939250505056fea2646970667358221220f4f3c071d7c46a497d2c39acf72dacf0a8187969fc880f109b51bcd4d3120e1664736f6c634300080c0033";
