import { BigNumber, ethers } from "ethers";
import { type Ref, ref, type ShallowRef } from "vue";
import { Account } from "../models/Account";
import { Deferred } from "../utils/deferred";
import { BaseProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

let _providerKey: string;
let _chain: AddEthereumChainParameter;

const isConnecting: Ref<boolean> = ref(false);
const provider: ShallowRef<ethers.providers.Web3Provider | undefined> = ref();
const account: ShallowRef<Account | undefined> = ref();
const balance: Ref<BigNumber | undefined> = ref();

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

async function connect() {
  isConnecting.value = true;

  // TODO: Allow to select different wallet providers?
  provider.value = new ethers.providers.Web3Provider(window.ethereum, "any");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: _chain.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      // TODO: Handle the add error.
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [_chain],
      });
    } else {
      throw switchError;
    }
  }

  window.localStorage.setItem(_providerKey, "generic");

  await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!window.ethereum.selectedAddress)
    throw "Did not select an Ethereum address";

  account.value = Account.getOrCreateFromAddress(
    window.ethereum.selectedAddress,
    true
  );

  isConnecting.value = false;

  provider.value.on("block", () => {
    provider
      .value!.getBalance(account.value!.address.value!.toString())
      .then((b) => {
        if (!balance.value || !b.eq(balance.value)) {
          balance.value = b;
        }
      });
  });

  window.ethereum.on("accountsChanged", function (accounts) {
    if (accounts.length > 0) {
      account.value = Account.getOrCreateFromAddress(accounts[0], true);
      fireOnConnectCallbacks(true);
      isConnecting.value = false;
    } else {
      disconnect();
    }
  });

  window.ethereum.on("disconnect", function () {
    window.ethereum.removeAllListeners();
    disconnect();
  });

  window.ethereum.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    // See https://docs.ethers.io/v5/concepts/best-practices/.
    if (oldNetwork) {
      window.location.reload();
    }
  });

  window.ethereum.on("chainChanged", function (chainId) {
    window.location.reload();
  });

  fireOnConnectCallbacks();
}

async function disconnect() {
  console.debug("Disconnecting from wallet provider");
  window.localStorage.removeItem(_providerKey);

  provider.value = undefined;
  account.value = undefined;
  balance.value = undefined;

  fireOnDisconnectCallbacks();
}

function onConnect(
  callback: (
    provider: ethers.providers.Web3Provider,
    account: Account,
    isReconnect: boolean
  ) => void
) {
  const obj: OnConnectCallbackWrapper = { callback, cancelled: false };
  const cancel = () => (obj.cancelled = true);

  if (provider.value && account.value) {
    callback(provider.value, account.value, false);
  } else {
    onConnectCallbacks.push(obj);
  }

  return cancel;
}

function onDisconnect(callback: () => void) {
  const obj: OnDisconnectCallbackWrapper = { callback, cancelled: false };
  const cancel = () => (obj.cancelled = true);
  onDisconnectCallbacks.push(obj);
  return cancel;
}

type OnConnectCallbackWrapper = {
  readonly callback: (
    provider: ethers.providers.Web3Provider,
    account: Account,
    relogin: boolean
  ) => void;
  cancelled: boolean;
};

type OnDisconnectCallbackWrapper = {
  readonly callback: () => void;
  cancelled: boolean;
};

const onConnectCallbacks: OnConnectCallbackWrapper[] = [];
const onDisconnectCallbacks: OnDisconnectCallbackWrapper[] = [];

function fireOnConnectCallbacks(isReconnect: boolean = false) {
  let i = onConnectCallbacks.length;

  while (i--) {
    const obj = onConnectCallbacks[i];
    if (!obj.cancelled)
      obj.callback(provider.value!, account.value!, isReconnect);
    onConnectCallbacks.splice(i, 1);
  }
}

function fireOnDisconnectCallbacks() {
  let i = onDisconnectCallbacks.length;

  while (i--) {
    const obj = onDisconnectCallbacks[i];
    if (!obj.cancelled) obj.callback();
    onDisconnectCallbacks.splice(i, 1);
  }
}

export function useEth() {
  const init = async (
    chain: AddEthereumChainParameter,
    providerKey: string,
    autoLogin?: boolean
  ) => {
    _chain = chain;
    _providerKey = providerKey;

    let ethPromise: Deferred<void> | undefined;

    if (!window.ethereum) {
      console.debug("No ethereum provider found, adding listener");

      ethPromise = new Deferred();
      window.addEventListener(
        "ethereum#initialized",
        () => {
          ethPromise?.resolve();
        },
        {
          once: true,
        }
      );
    }

    await ethPromise?.promise;

    if (autoLogin && window.localStorage.getItem(_providerKey)) {
      connect();
    }
  };

  return {
    init,
    connect,
    isConnecting,
    account,
    provider,
    balance,
    disconnect,
    onConnect,
    onDisconnect,
  };
}
