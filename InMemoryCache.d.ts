import type { DataCache, Nullish } from './types';
export declare class InMemoryCache implements DataCache<unknown> {
    protected readonly map: Map<string, string>;
    get<T = unknown>(key: string): Promise<Nullish<T>>;
    delete(key: string): Promise<boolean>;
    set(key: string, value: unknown): Promise<boolean>;
    has(key: string): Promise<boolean>;
    clear(): Promise<boolean>;
    keys(): AsyncGenerator<string, void, undefined>;
}
