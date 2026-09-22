// Safe wrapper around localStorage that gracefully handles:
// - Third-party iframe restrictions
// - Disabled cookies / incognito security restrictions
// - QuotaExceededError
// - Server-side / Node execution environments

const memoryStore = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] Unable to read "${key}" from localStorage, falling back to memory:`, e);
    }
    return memoryStore.get(key) ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[safeStorage] Unable to write "${key}" to localStorage, falling back to memory:`, e);
    }
    memoryStore.set(key, value);
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] Unable to remove "${key}" from localStorage:`, e);
    }
    memoryStore.delete(key);
  }
};
