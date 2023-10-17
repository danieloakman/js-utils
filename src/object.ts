import { isObjectLike, safeCall } from './functional';
import { ObjectWithValueAtPath, Split } from './types';

export type KeyItentifier<T> = string | ((item: T) => string);

/**
 * Groups elements together from a `T[]`, use the `key` function to determine how to group. Similar to lodash's groupBy
 * except allows multiple groups to be created from one iteration of `arr`.
 */
export function groupBy<T>(arr: T[], key: KeyItentifier<T>): Record<string, T[]>;
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]): Record<string, T[]>[];
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]) {
  const results = keys.map(key => [key, {} as Record<string, T[]>] as const);
  for (const value of arr) {
    for (const [key, map] of results) {
      const k = typeof key === 'string' ? (value as any)?.[key] : key(value);
      map[k] = (map[k] ?? ([] as any[])).concat(value);
    }
  }
  return results.length < 2 ? results[0][1] : results.map(([_, map]) => map);
}

/** Safely parses a JSON string. If an error occurs, then null is returned. */
export function safeJSONParse<T = unknown>(...args: Parameters<typeof JSON.parse>): T | null {
  return safeCall(JSON.parse, ...args);
}

export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'string',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, string>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'number',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, number>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'bigint',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, bigint>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'boolean',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, boolean>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'symbol',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, symbol>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'undefined',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, undefined>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'object',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, object>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'function',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, () => any>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'null',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, null>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'nullish',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, null | undefined>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'record',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, Record<PropertyKey, unknown>>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'array',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, unknown[]>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type: 'string[]',
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, string[]>;
export function propIs<T, Key extends string>(
  obj: T,
  key: Key,
  type:
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'object'
    | 'function'
    | 'null'
    | 'nullish'
    | 'record'
    | 'array'
    | 'string[]',
): boolean {
  if (!key.length) return false;
  let currentObj: unknown = obj;
  for (const k of key.split('.')) {
    if (!isObjectLike(currentObj)) return false;
    currentObj = currentObj[k];
  }
  if (type === 'null') return currentObj === null;
  if (type === 'nullish') return currentObj === null || currentObj === undefined;
  if (type === 'record') return typeof currentObj === 'object' && currentObj !== null;
  if (type === 'array') return Array.isArray(currentObj);
  if (type === 'string[]') return Array.isArray(currentObj) && currentObj.every(v => typeof v === 'string');
  return typeof currentObj === type;
}
