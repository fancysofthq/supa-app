export class Uint8 {
  readonly value: number;

  static get max(): Uint8 {
    return new Uint8(255);
  }

  static zeroes(length: number): Uint8Array {
    return new Uint8Array(length);
  }

  constructor(value: number) {
    if (value < 0 || value > 255) throw new Error("Invalid Uint8 value");
    this.value = value;
  }
}

/**
 * Search for a multi-byte `pattern` in `bytes`.
 */
export function indexOfMulti(bytes: Uint8Array, pattern: Uint8Array): number {
  const patternLength = pattern.length;
  const bytesLength = bytes.length;

  for (let i = 0; i < bytesLength; i++) {
    if (bytes[i] === pattern[0]) {
      let found = true;

      for (let j = 1; j < patternLength; j++) {
        if (bytes[i + j] !== pattern[j]) {
          found = false;
          break;
        }
      }

      if (found) {
        return i;
      }
    }
  }

  return -1;
}
