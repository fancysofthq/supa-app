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
