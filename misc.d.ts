import { Fn } from './types';
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
/**
 * Declares and runs a main function if the entry point to the program is `module`. This is esstentially the same as
 * python's `if __name__ == '__main__'` block.
 * @param module If on node, then this will be passed in as `module`. If on `bun` or `browser` then pass in
 * `import.meta.path`, i.e. the program's entry poing as an absolute path.
 * @param mainFn The main function to run.
 */
export declare const main: (module: any, mainFn: () => Promise<void>) => Promise<void>;
export type ShellCommandOptions = Omit<Parameters<typeof import('child_process')['spawn']>[2], 'shell' | 'stdio'> & {
    /**
     * @description If true then will pipe stdout and stderr of the spawned shell to console.
     * @default true
     */
    log?: boolean;
};
/** Runs a shell command and returns the output. If the command fails, then an error is returned. */
export declare const sh: (command: string, options?: ShellCommandOptions) => Promise<Error | string>;
