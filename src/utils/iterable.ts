import { Buffer } from "buffer";

export function iteratorToStream(iterator: AsyncIterable<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      for await (const value of iterator) {
        controller.enqueue(value);
      }

      controller.close();
    },
  });
}

export async function iteratorToBuffer(
  iterator: AsyncIterable<Uint8Array>
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of iterator) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
