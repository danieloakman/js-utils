import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

import type { DataCache, Nullish } from './types';

export class FSCache<T = unknown> implements DataCache<T> {
  get<U = T>(key: string): Promise<Nullish<U>> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  set(key: string, value: string | T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  has(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  keys(): AsyncIterableIterator<string> {
    throw new Error('Method not implemented.');
  }
  get size(): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
