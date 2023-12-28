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
/**
 * Runs a shell command with stdio set to inherit. This means all stdio is shared with the current process.
 * If the command fails, then an error is returned, otherwise true is returned.
 */
export declare const sh: (...commands: string[]) => Promise<Error | boolean>;
/**
 * Executes a shell command and returns the stdout and stderr as a string. If the command fails, then an error is
 * returned.
 */
export declare const exec: (...commands: string[]) => Promise<Error | string>;
/** Returns true if node is debugging. */
export declare const isInDebug: () => boolean;
export declare const question: (questionStr: string, defaultAnswer?: string | null | undefined) => Promise<string>;
