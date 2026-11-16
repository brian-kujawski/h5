/** Web preview storage. The web build is only a preview, so localStorage is enough. */

export function readItem(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Private windows can refuse storage; preferences just won't persist.
  }
}
