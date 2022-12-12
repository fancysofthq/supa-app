export function notNull<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("notNull assertion failed");
  }

  return value;
}

export class Box<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
