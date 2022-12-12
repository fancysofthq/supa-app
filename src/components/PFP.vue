<script lang="ts">
import { usePersona } from "../services/eth/Persona";
import { Ierc165Factory } from "../services/eth/contracts/Ierc165Factory";
import { Ierc721MetadataFactory } from "../services/eth/contracts/Ierc721MetadataFactory";
import { Ierc1155MetadataUriFactory } from "../services/eth/contracts/Ierc1155MetadataUriFactory";
import { Address } from "../services/eth/Address";

function pfpCacheKey(account: Address) {
  return `cache.pfp.${account}`;
}

export function invalidatePfpCache(account: Address) {
  useLocalStorage(pfpCacheKey(account), "").value = "";
}

/**
 * Return a raw `"image"` key value from an according NFT metadata.
 *
 * @param ipfsGateway Needed to gatewayize the token metadata URI.
 */
export async function queryPfpUrl(
  account: Address,
  ipfsGateway: string
): Promise<URL | undefined> {
  const cacheKey = pfpCacheKey(account);

  const cached = window.localStorage.getItem(cacheKey);
  if (cached) return new URL(cached);

  const { db: personaDb } = usePersona();

  const persona = await personaDb.value!.personas.get(account.toString());
  const pfp = persona?.pfp;

  if (pfp) {
    const erc165 = Ierc165Factory.connect(
      pfp.contract.toString(),
      personaDb.value!.contract.provider
    );
    let rawTokenURI: string;

    if (await erc165.supportsInterface("0x5b5e139f")) {
      const erc721 = Ierc721MetadataFactory.connect(
        pfp.contract.toString(),
        personaDb.value!.contract.provider
      );

      rawTokenURI = (await erc721.tokenURI(pfp.id))
        .toString()
        .replaceAll("{id}", pfp.id._hex.slice(2));
    } else if (await erc165.supportsInterface("0x0e89341c")) {
      const nft = Ierc1155MetadataUriFactory.connect(
        pfp.contract.toString(),
        personaDb.value!.contract.provider
      );

      rawTokenURI = (await nft.uri(pfp.id))
        .toString()
        .replaceAll("{id}", pfp.id._hex.slice(2));
    } else {
      throw new Error("Unsupported PFP contract");
    }

    const processedTokenURI = ipfs.gatewayize(
      new URL(rawTokenURI),
      ipfsGateway
    );
    const response = await fetch(processedTokenURI);
    const json = await response.json();
    const image = json.image;

    window.localStorage.setItem(cacheKey, image);

    return new URL(image);
  }
}
</script>

<script setup lang="ts">
import { type Ref, ref, onMounted, watch } from "vue";
import * as jdenticon from "jdenticon";
import { type Account } from "../models/Account";
import * as ipfs from "../services/ipfs";
import { useLocalStorage } from "@vueuse/core";

const { account, ipfsGateway = "w3s.link" } = defineProps<{
  account: Account;
  ipfsGateway?: string;
}>();

const img: Ref<URL | undefined> = ref();
const svgRef: Ref<SVGElement | null> = ref(null);

function updateSvg() {
  jdenticon.updateSvg(svgRef.value!, account.address.value);
}

onMounted(async () => {
  await account.resolveAddress();

  updateSvg();

  watch(
    () => useLocalStorage(pfpCacheKey(account.address.value!), "").value,
    () => queryPfp,
    { immediate: true }
  );
});

async function queryPfp() {
  const url = await queryPfpUrl(account.address.value!, ipfsGateway);
  if (url) img.value = ipfs.gatewayize(url, ipfsGateway);
  else img.value = undefined;
}
</script>

<template lang="pug">
.pfp.flex.items-center.justify-center.overflow-hidden
  img.h-full.w-full(v-if="img" :src="img.toString()")
  svg.h-full.w-full(v-else ref="svgRef")
</template>
