import { alwaysRaise, attempt, constant, iife } from './functional';
import { Fn, Result } from './types';

/**
 * If Bun.env['RUNTIME'] is node compatible, then `fn` is returned as is, otherwise a function that raises an exception is
 * returned.
 */
export function nodeOnly<T extends Fn>(fn: T): T {
  if (!(Bun.env['RUNTIME'] === 'node' || Bun.env['RUNTIME'] === 'bun'))
    return alwaysRaise('This function is only available in Node compatible run times (e.g. Node, Bun).') as any;
  return fn;
}

/**
 * Alias for `require`. This also acts as a way to circumvent bundle checking of node modules when the target isn't
 * node compatible.
 */
export const importSync: (name: string) => any = (name: string) => require(name);

/**
 * @description
 * **NODE ONLY**
 * Declares and runs a main function if the entry point to the program is `module`. This is esstentially the same as
 * python's `if __name__ == '__main__'` block. If on Bun runtime, use `if (import.meta.main) app()` instead.
 * @param module Always pass in the global variable: `module`.
 * @param mainFn The main function to run.
 * @example
 * main(module, async () => {
 *  // do stuff
 * });
 */
export const main: (module: any, mainFn: () => Promise<void>) => Promise<void> =
  Bun.env['RUNTIME'] === 'node'
    ? async (module, mainFn) => {
        // @ts-ignore
        if (require?.main === module) mainFn();
      }
    : // : Bun.env['RUNTIME'] === 'bun'
      // ? async (module, mainFn) => {
      //     // TODO: fix this for bun
      //     if (module === Bun.main) mainFn();
      //   }
      // TODO: browser may be able to work with bun's way of doing things, so perhaps this can be removed.
      alwaysRaise('Cannot have a main function in this runtime environment.');

/**
 * Runs a shell command with stdio set to inherit. This means all stdio is shared with the current process.
 * If the command fails, then an error is returned, otherwise true is returned.
 */
export const sh: (...commands: string[]) => Promise<Error | boolean> =
  Bun.env['RUNTIME'] === 'browser'
    ? alwaysRaise('Cannot run shell commands in browser.')
    : (...commands: string[]) =>
        iife(({ spawn }: typeof import('child_process') = importSync('child_process')) => {
          const fullCommand = commands.join('\n');

          return new Promise(resolve => {
            const s = attempt(() => spawn(fullCommand, { shell: true, stdio: 'inherit', env: { ...process.env } }));
            if (s instanceof Error) return resolve(s);

            s.on('close', code => {
              if (code) resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));
              else resolve(true);
            });
            s.on('error', err => resolve(err));
          });
        });

/**
 * Executes a shell command and returns the stdout and stderr as a string. If the command fails, then an error is
 * returned.
 */
export const exec: (...commands: string[]) => Promise<Error | string> =
  Bun.env['RUNTIME'] === 'browser'
    ? alwaysRaise('Cannot run shell commands in browser.')
    : (...commands: string[]) =>
        iife(({ spawn }: typeof import('child_process') = importSync('child_process')) => {
          const fullCommand = commands.join('\n');

          return new Promise(resolve => {
            const s = attempt(() => spawn(fullCommand, { shell: true, env: { ...process.env } }));
            if (s instanceof Error) return resolve(s);
            let data = '';
            const handleData = (chunk: Buffer) => {
              const str = chunk.toString();
              data += str + '\n';
            };
            s.stdout?.on('data', handleData);
            s.stderr?.on('data', handleData);
            s.on('close', code => {
              if (code) resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));
              else resolve(data);
            });
            s.on('error', err => resolve(err));
          });
        });

/**
 * Executes a shell command and returns the stdout and stderr as a string. If the command fails, then an error is
 * returned.
 */
export const execSync: (command: string) => Result<string> =
  Bun.env['RUNTIME'] === 'browser'
    ? alwaysRaise('Cannot run shell commands in browser.')
    : (command: string) =>
        iife(({ execSync }: typeof import('child_process') = importSync('child_process')) =>
          attempt(() => execSync(command, { encoding: 'utf-8', env: process.env, shell: true as any })),
        );

/** Returns true if node is debugging. */
export const isInDebug: () => boolean =
  Bun.env['RUNTIME'] !== 'browser'
    ? () => typeof require('inspector').url() !== 'undefined'
    : alwaysRaise('Not implemented for browser.');

export const question: (questionStr: string, defaultAnswer?: string | null | undefined) => Promise<string> =
  Bun.env['RUNTIME'] !== 'browser'
    ? async (questionStr, defaultAnswer?) => {
        if (isInDebug()) return defaultAnswer || '';
        const readline = await import('readline');
        const r1 = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        return new Promise(resolve =>
          r1.question(questionStr, answer => {
            r1.close();
            resolve(answer || defaultAnswer || '');
          }),
        );
      }
    : alwaysRaise('Cannot ask questions in browser.');

/** Returns an iterable of all local IP addresses. */
export function* localIPs(): IterableIterator<{ name: string; address: string }> {
  const networkInterfaces =
    Bun.env['RUNTIME'] === 'browser' ? constant([]) : (require('os') as typeof import('os')).networkInterfaces;
  for (const [name, nets] of Object.entries(networkInterfaces())) {
    for (const net of nets ?? []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        yield { name, address: net.address };
      }
    }
  }
}
