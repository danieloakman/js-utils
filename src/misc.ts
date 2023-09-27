import { attempt, iife, raise } from './functional';
import { Fn } from './types';

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

/**
 * Runs a shell command with stdio set to inherit. This means all stdio is shared with the current process.
 * If the command fails, then an error is returned, otherwise true is returned.
 */
export const sh: (command: string) => Promise<Error | boolean> =
  Bun.env.RUNTIME === 'browser'
    ? () => raise('Cannot run shell commands in browser.')
    : (command: string) =>
        iife(({ spawn }: typeof import('child_process') = importSync('child_process')) => {
          // options.log = options.log ?? true;

          return new Promise(resolve => {
            const s = attempt(() => spawn(command, { shell: true, stdio: 'inherit' }));
            if (s instanceof Error) return resolve(s);

            s.on('close', code => {
              if (code) resolve(new Error(`Command "${command}" exited with code ${code}`));
              else resolve(true);
            });
            s.on('error', err => resolve(err));
          });
        });

/**
 * Executes a shell command and returns the stdout and stderr as a string. If the command fails, then an error is
 * returned.
 */
export const exec: (command: string) => Promise<Error | string> =
  Bun.env.RUNTIME === 'browser'
    ? () => raise('Cannot run shell commands in browser.')
    : (command: string) =>
        iife(({ spawn }: typeof import('child_process') = importSync('child_process')) => {
          return new Promise(resolve => {
            const s = attempt(() => spawn(command, { shell: true }));
            if (s instanceof Error) return resolve(s);
            let data = '';
            const handleData = (chunk: Buffer) => {
              const str = chunk.toString();
              data += str + '\n';
            };
            s.stdout?.on('data', handleData);
            s.stderr?.on('data', handleData);
            s.on('close', code => {
              if (code) resolve(new Error(`Command "${command}" exited with code ${code}`));
              else resolve(data);
            });
            s.on('error', err => resolve(err));
          });
        });
