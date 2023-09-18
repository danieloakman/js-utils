export type KeyItentifier<T> = string | ((item: T) => string);
/**
 * Groups elements together from a `T[]`, use the `key` function to determine how to group. Similar to lodash's groupBy
 * except allows multiple groups to be created from one iteration of `arr`.
 */
export declare function groupBy<T>(arr: T[], key: KeyItentifier<T>): Record<string, T[]>;
export declare function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]): Record<string, T[]>[];
export declare function safeJSONParse<T = unknown>(...args: Parameters<typeof JSON.parse>): T;
