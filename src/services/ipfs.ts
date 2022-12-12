import { CID } from "multiformats";
import { base16 } from "multiformats/bases/base16";

function parseCID(cid: string): CID {
  if (cid.startsWith("f")) {
    return CID.parse(cid, base16);
  } else {
    return CID.parse(cid);
  }
}

/**
 * Return a gateway-ed URL, or itself if it's not an IPFS URL.
 */
export function gatewayize(uri: URL | string, gateway: string): URL {
  if (!(uri instanceof URL)) uri = new URL(uri);

  // http://bafybeieau5imsrax5gipbwoxxdyb3pz3a5c4n2ojl2u6jk7yuwjhgrkif4.ipfs/IMG_4726.jpeg
  // https://bafybeieau5imsrax5gipbwoxxdyb3pz3a5c4n2ojl2u6jk7yuwjhgrkif4.ipfs.nftstorage.link/IMG_4726.jpeg
  let match = uri.host.match(/(?<cid>\w+)\.ipfs/);
  if (match) {
    return new URL(
      "https://" +
        parseCID(match[1]).toString() +
        ".ipfs." +
        gateway +
        uri.pathname
    );
  }

  // ipfs://bafybeieau5imsrax5gipbwoxxdyb3pz3a5c4n2ojl2u6jk7yuwjhgrkif4/IMG_4726.jpeg
  // https://bafybeieau5imsrax5gipbwoxxdyb3pz3a5c4n2ojl2u6jk7yuwjhgrkif4.ipfs.nftstorage.link/IMG_4726.jpeg
  if (uri.protocol == "ipfs:") {
    match = uri.pathname.match(/^\/\/(?<cid>\w+)\/(.+)/);

    if (match) {
      return new URL(
        "https://" +
          parseCID(match[1]).toString() +
          ".ipfs." +
          gateway +
          "/" +
          match[2]
      );
    } else {
      throw new Error("Unhandled IPFS uri case: " + uri);
    }
  }

  return uri;
}

/**
 * Return `"http://{cid}.ipfs"`.
 */
export function toIpfsUri(cid: CID): URL {
  return new URL("http://" + cid.toString() + ".ipfs");
}

/**
 * @example displayCid(cid) //=> "bafy…kif4"
 */
export function displayCid(cid: CID): string {
  return cid.toString().slice(0, 4) + "…" + cid.toString().slice(-4);
}
