/** On-device key-value storage. Native uses SQLite (already needed for the Phase 1 search index). */
import Storage from 'expo-sqlite/kv-store';

export function readItem(key: string): string | null {
  try {
    return Storage.getItemSync(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    Storage.setItemSync(key, value);
  } catch {
    // Losing a preference is not worth crashing circle over.
  }
}
