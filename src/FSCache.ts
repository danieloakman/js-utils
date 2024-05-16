// import { existsSync } from 'fs';
// import { readFile, writeFile } from 'fs/promises';
import type { DataCache, Nullish } from './types';

export class FSCache<T = unknown> implements DataCache<T> {
  get size(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  get<U = T>(_key: string): Promise<Nullish<U>> {
    throw new Error('Method not implemented.');
  }
  delete(_key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  set(_key: string, _value: string | T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  has(_key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  keys(): AsyncIterableIterator<string> {
    throw new Error('Method not implemented.');
  }
}
