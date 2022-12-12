import { Address } from "./eth/Address";
import { type Name } from "./ens/Name";

export type Response = {
  address: Address;
  name: Name | null;
  displayName: string | null;
  avatar: string | null;
};

/**
 * @param address case-insensitive, starting with `0x`, or a name ending with `.eth`.
 */
export async function resolve(address: string): Promise<Response> {
  const raw = await (
    await fetch(`https://api.ensideas.com/ens/resolve/${address}`)
  ).json();

  return {
    address: new Address(raw.address),
    name: raw.name,
    displayName: raw.displayName,
    avatar: raw.avatar,
  };
}
