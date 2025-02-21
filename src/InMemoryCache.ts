import { safeJSONParse } from './object';
import type { DataCache, Nullish } from './types';

export class InMemoryCache<T = unknown> implements DataCache<T> {
  protected readonly map: Map<string, string> = new Map<string, string>();

  get size(): Promise<number> {
    return Promise.resolve(this.map.size);
  }

  async get(key: string): Promise<Nullish<T>> {
    const value = this.map.get(key);
    return safeJSONParse(value ?? '');
  }

  async delete(key: string): Promise<boolean> {
    return this.map.delete(key);
  }

  async set(key: string, value: unknown): Promise<boolean> {
    this.map.set(key, typeof value !== 'string' ? JSON.stringify(value) : value);
    return true;
  }

  async has(key: string): Promise<boolean> {
    return this.map.has(key);
  }

  async clear(): Promise<boolean> {
    this.map.clear();
    return true;
  }

  async *keys(): AsyncIterableIterator<string> {
    yield* this.map.keys();
  }
}
