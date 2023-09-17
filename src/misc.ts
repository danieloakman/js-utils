import { iife, raise } from './functional';
import { Fn } from './types';

// let main: (module: any, mainFunction: () => Promise<void>) => Promise<void>;
// if (process.env.BUILD_TARGET === 'node') {
//   main = async (module: any, mainFunction: () => Promise<void>) => {
//     if (require?.main !== module) return;
//     return mainFunction();
//   };
// }
// export const main = main;

/**
 * If Bun.env.RUNTIME is node compatible, then `fn` is returned as is, otherwise a function that raises an exception is
 * returned.
 */
export function nodeOnly<T extends Fn>(fn: T): T {
  if (!(Bun.env.RUNTIME === 'node' || Bun.env.RUNTIME === 'bun'))
    return ((..._: any[]) =>
      raise('This function is only available in Node compatible run times (e.g. Node, Bun).')) as any;
  return fn;
}

/**
 * Alias for `require`. This also acts as a way to circumvent bundle checking of node modules when the target isn't
 * node compatible.
 */
export const importSync = (name: string) => require(name);

/**
 * Declares and runs a main function if the entry point to the program is `module`. This is esstentially the same as
 * python's `if __name__ == '__main__'` block.
 * @param module If on node, then this will be passed in as `module`. If on `bun` or `browser` then pass in
 * `import.meta.path`, i.e. the program's entry poing as an absolute path.
 * @param mainFn The main function to run.
 */
export const main: (module: any, mainFn: () => Promise<void>) => Promise<void> =
  Bun.env.RUNTIME === 'node'
    ? async (module, mainFn) => {
        // @ts-ignore
        if (require?.main === module) mainFn();
      }
    : Bun.env.RUNTIME === 'bun'
    ? async (module, mainFn) => {
        // TODO: fix this for bun
        if (module === Bun.main) mainFn();
      }
    : // TODO: browser may be able to work with bun's way of doing things, so perhaps this can be removed.
      (..._: any[]) => raise('Cannot have a main function in this runtime environment.');

export type ShellCommandOptions = Omit<Parameters<typeof import('child_process')['spawn']>[2], 'shell' | 'stdio'> & {
  /**
   * @description If true then will pipe stdout and stderr of the spawned shell to console.
   * @default true
   */
  log?: boolean;
};

/** Runs a shell command and returns the output. If the command fails, then an error is returned. */
export const sh = nodeOnly(
  (command: string, options: ShellCommandOptions = {}): Promise<Error | string> =>
    iife(({ spawn }: typeof import('child_process') = importSync('child_process')) => {
      options.log = options.log ?? true;

      return new Promise(resolve => {
        const s = spawn(command, Object.assign({ shell: true }, options));
        let data = '';
        const handleData = (chunk: Buffer) => {
          const str = chunk.toString();
          data += str + '\n';
          // eslint-disable-next-line no-console
          if (options.log) console.log(str);
        };

        s.on('close', code => {
          if (code) resolve(new Error(`Command "${command}" exited with code ${code}`));
          else resolve(data);
        });
        s.on('error', resolve);
        s.stdout?.on('data', handleData);
        s.stderr?.on('data', handleData);
      });
    }),
);
