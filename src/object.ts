import map from 'iteragain/map';
import toArray from 'iteragain/toArray';
import { safeCall } from './functional';

export type KeyItentifier<T> = string | ((item: T) => string);

/**
 * Groups elements together from a `T[]`, use the `key` function to determine how to group. Similar to lodash's groupBy
 * except allows multiple groups to be created from one iteration of `arr`.
 */
export function groupBy<T>(arr: T[], key: KeyItentifier<T>): Record<string, T[]>;
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]): Record<string, T[]>[];
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]) {
  const results = toArray(map(keys, key => [key, {} as Record<string, T[]>] as const));
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
