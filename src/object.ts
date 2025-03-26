import { enumerate, filterMap, toArray } from 'iteragain';

import { isObjectLike, safeCall } from './functional';
import { Comparator, ObjectWithValueAtPath, Split } from './types';

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
  return results.length < 2 ? (results[0]?.[1] ?? {}) : results.map(([_, map]) => map);
}

/** Safely parses a JSON string. If an error occurs, then null is returned. */
export function safeJSONParse<T = unknown>(...args: Parameters<typeof JSON.parse>): T | null {
  return safeCall(JSON.parse, ...args) as T | null;
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
export function propIs<T, Key extends string, N extends number>(
  obj: T,
  key: Key,
  type: N,
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, N>;
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
): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, (...args: any[]) => unknown>;
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
    | 'string[]'
    | number,
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
  if (typeof type === 'number') return currentObj === type;
  return typeof currentObj === type;
}

export function sortByKeys<T extends Record<string, unknown>>(
  obj: T,
  comparator: Comparator<string, number> = (a, b) => a.localeCompare(b),
): T {
  return Object.keys(obj)
    .sort(comparator)
    .reduce((acc, key) => {
      const value = obj[key];
      if (!Array.isArray(value) && isObjectLike(value)) (acc as any)[key] = sortByKeys(value, comparator);
      else (acc as any)[key] = value;
      return acc;
    }, {} as T);
}

/** Returns true if all of `obj`'s properties can be found and are equal to those in `other`. */
export function isPartiallyLike<T extends Record<PropertyKey, unknown> | unknown[]>(
  obj: unknown,
  other: T,
): obj is Partial<T> {
  if (!isObjectLike(obj) || !isObjectLike(other)) return false;
  if (!Object.keys(obj).length) return !Object.keys(other).length;

  if (Array.isArray(obj) && Array.isArray(other)) {
    if (obj.length !== other.length) return false;
    for (const [idx, value] of enumerate(obj)) {
      if (isObjectLike(value) && isObjectLike(other[idx])) {
        if (!isPartiallyLike(value, other[idx] as any)) return false;
      } else if (other[idx] !== value) return false;
    }
    return true;
  }

  let hasAtleastOne = false;
  for (const [key, value] of Object.entries(obj)) {
    if (!(key in other)) continue;
    if (isObjectLike(value) && isObjectLike(other[key])) {
      if (!isPartiallyLike(value, other[key] as any)) return false;
      hasAtleastOne = true;
    } else if (other[key] === value) hasAtleastOne = true;
    else return false;
  }
  return hasAtleastOne;
}

export function findItemsFrom<T extends object>(needles: Partial<T>[], haystack: T[]): [found: T[], notFound: T[]] {
  // TODO: This could probably be refactored to use `tee` and return two iterators.
  needles = needles.slice();
  const found: number[] = [];
  const notFound: number[] = [];
  loop: for (const [i, item] of enumerate(haystack)) {
    for (const [j, needle] of enumerate(needles)) {
      if (isPartiallyLike(item, needle)) {
        found.push(i);
        needles.splice(j, 1);
        continue loop;
      }
    }
    notFound.push(i);
  }
  return [toArray(filterMap(found, i => haystack[i])), toArray(filterMap(notFound, i => haystack[i]))];
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K>;
export function omit<T extends object>(obj: T, keys: string[]): T; // Allow any key, but don't get type safety
export function omit<T extends object>(obj: T, ...keys: string[]): T;
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[] | [K[]]): Omit<T, K> {
  const _keys = (Array.isArray(keys[0]) ? keys[0] : keys) as K[];
  const copy = { ...obj };
  for (const key of _keys) delete copy[key];
  return copy;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
export function pick<T extends object>(obj: T, keys: string[]): T; // Allow any key, but don't get type safety
export function pick<T extends object>(obj: T, ...keys: string[]): T;
export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[] | [K[]]): Pick<T, K> {
  const _keys = (Array.isArray(keys[0]) ? keys[0] : keys) as K[];
  const copy = {} as Pick<T, K>;
  for (const key of _keys) {
    const value = obj[key];
    if (value != undefined) copy[key] = value;
  }
  return copy;
}

/** Returns true if `a` and `b` are deeply equal. Does not check for alphabetical order. */
export function isObjectDeepEqual(a: object, b: object): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => isObjectDeepEqual(value, b[index]));
  }
  const aType = typeof a;
  const bType = typeof b;
  if (aType !== bType || aType !== 'object') return false;
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const [key, value] of Object.entries(a)) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isObjectDeepEqual(value, b[key as keyof typeof b])) return false;
  }
  return true;
}
