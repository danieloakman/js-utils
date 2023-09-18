import type { DataCache, Nullish } from './types';
import { safeJSONParse } from './object';

export class InMemoryCache implements DataCache<unknown> {
  protected readonly map = new Map<string, string>();

  async get<T = unknown>(key: string): Promise<Nullish<T>> {
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

  async *keys() {
    yield* this.map.keys();
  }
}
