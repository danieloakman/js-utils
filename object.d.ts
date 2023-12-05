import { ObjectWithValueAtPath, Split, Comparator } from './types';
export type KeyItentifier<T> = string | ((item: T) => string);
/**
 * Groups elements together from a `T[]`, use the `key` function to determine how to group. Similar to lodash's groupBy
 * except allows multiple groups to be created from one iteration of `arr`.
 */
export declare function groupBy<T>(arr: T[], key: KeyItentifier<T>): Record<string, T[]>;
export declare function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]): Record<string, T[]>[];
/** Safely parses a JSON string. If an error occurs, then null is returned. */
export declare function safeJSONParse<T = unknown>(...args: Parameters<typeof JSON.parse>): T | null;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'string'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, string>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'number'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, number>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'bigint'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, bigint>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'boolean'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, boolean>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'symbol'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, symbol>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'undefined'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, undefined>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'object'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, object>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'function'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, () => any>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'null'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, null>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'nullish'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, null | undefined>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'record'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, Record<PropertyKey, unknown>>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'array'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, unknown[]>;
export declare function propIs<T, Key extends string>(obj: T, key: Key, type: 'string[]'): obj is T & ObjectWithValueAtPath<Split<Key, '.'>, string[]>;
export declare function sortByKeys<T extends Record<string, unknown>>(obj: T, comparator?: Comparator<string>): T;
