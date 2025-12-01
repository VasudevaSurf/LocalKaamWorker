import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'localkaam_cache_';
const DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiration: number;
}

export const cache = {
  /**
   * Store data in cache
   * @param key Cache key
   * @param data Data to store
   * @param expirationDuration Duration in ms (default 5 mins)
   */
  set: async <T>(
    key: string,
    data: T,
    expirationDuration: number = DEFAULT_EXPIRATION,
  ): Promise<void> => {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiration: expirationDuration,
      };
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  /**
   * Retrieve data from cache
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const json = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!json) return null;

      const item: CacheItem<T> = JSON.parse(json);
      const now = Date.now();

      if (now - item.timestamp > item.expiration) {
        // Cache expired
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Remove item from cache
   * @param key Cache key
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  /**
   * Clear all app cache
   */
  clearAll: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  },
};
