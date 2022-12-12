// Fast Uint8Array to hex.
// © https://stackoverflow.com/a/69585881/3645337.
export function bytes2Hex(bytes: Uint8Array): string {
  return Array.from(bytes || [])
    .map((b) => HEX_STRINGS[b >> 4] + HEX_STRINGS[b & 15])
    .join("");
}

// Mimics Buffer.from(x, 'hex') logic
// Stops on first non-hex string and returns
// https://github.com/nodejs/node/blob/v14.18.1/src/string_bytes.cc#L246-L261
// © https://stackoverflow.com/a/69585881/3645337.
export function hex2Bytes(hexString: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hexString.length / 2));

  let i;
  for (i = 0; i < bytes.length; i++) {
    const a = mapHex(hexString[i * 2]);
    const b = mapHex(hexString[i * 2 + 1]);

    if (a === undefined || b === undefined) {
      break;
    }

    bytes[i] = (a << 4) | b;
  }

  return i === bytes.length ? bytes : bytes.slice(0, i);
}

const HEX_STRINGS = "0123456789abcdef";

function mapHex(char: string) {
  switch (char) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;

    case "a":
      return 10;
    case "b":
      return 11;
    case "c":
      return 12;
    case "d":
      return 13;
    case "e":
      return 14;
    case "f":
      return 15;

    case "A":
      return 10;
    case "B":
      return 11;
    case "C":
      return 12;
    case "D":
      return 13;
    case "E":
      return 14;
    case "F":
      return 15;

    default:
      throw new Error("Invalid hex string: " + char);
  }
}
