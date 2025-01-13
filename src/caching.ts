import { DataCache, Nullish, SimpleDataCache } from './types';

export function toSimpleCache<T, U>(
  cache: DataCache<T>,
  options: { get: (value: Nullish<T>) => U; set: (value: U) => T },
): SimpleDataCache<U> {
  return {
    get: (key: string) => cache.get(key).then(options.get),
    set: (key: string, value: U) => cache.set(key, options.set(value)),
    delete: async (key: string) => cache.delete(key),
  };
}
