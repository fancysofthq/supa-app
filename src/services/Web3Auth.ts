import { ethers } from "ethers";
import Web3Token from "web3-token";
import { SignOpts } from "web3-token/lib/interfaces";

/**
 * Wraps a request in a Web3-Token authentication header.
 */
export function authRequest(req: Request, token: string) {
  req.headers.set("Authorization", `Bearer ${token}`);
}

/**
 * Ensures that the user is authenticated with the API.
 *
 * @param provider The Web3 provider to use for signing.
 * @param lsKey The key to use for storing the token in local storage.
 * @param apiAuth A function that takes a signature,
 * makes an API request, and returns a bearer token.
 *
 * @returns The bearer token.
 */
export async function ensureAuth(
  provider: ethers.providers.Web3Provider,
  lsKey: string,
  signOpts: SignOpts,
  apiAuth: (signature: string) => Promise<string>
): Promise<string> {
  let token = window.localStorage.getItem(lsKey);

  if (!token) {
    const signer = provider.getSigner();
    signOpts.chain_id ||= (await provider.getNetwork()).chainId;

    const signature = await Web3Token.sign(
      async (msg: string) => await signer.signMessage(msg),
      signOpts
    );

    token = await apiAuth(signature);
    window.localStorage.setItem(lsKey, token);
  } else {
    // TODO: Check for expiration; if expired,
    // clear the storage and call this function again.
  }

  return token;
}
