import { Fn } from './types';
export declare const RUNTIME: string;
export declare const IS_IN_NODE_COMPATIBLE_RUNTIME: boolean;
/**
 * If Bun.env.RUNTIME is node compatible, then `fn` is returned as is, otherwise a function that raises an exception is
 * returned.
 */
export declare function nodeOnly<T extends Fn>(fn: T): T;
/**
 * Alias for `require`. This also acts as a way to circumvent bundle checking of node modules when the target isn't
 * node compatible.
 */
export declare const importSync: (name: string) => any;
export type ShellCommandOptions = Omit<Parameters<typeof import('child_process')['spawn']>[2], 'shell' | 'stdio'> & {
    /**
     * @description If true then will pipe stdout and stderr of the spawned shell to console.
     * @default true
     */
    log?: boolean;
};
/** Runs a shell command and returns the output. If the command fails, then an error is returned. */
export declare const sh: (command: string, options?: ShellCommandOptions) => Promise<Error | string>;
