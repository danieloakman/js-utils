/*
 * Node related utilities.
 */

import { deepStrictEqual } from 'assert';
import { spawn } from 'child_process';

/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export const equal = <T>(actual: T, expected: T, message?: string | Error) =>
  deepStrictEqual(actual, expected, message);

export type ShellCommandOptions = Omit<Parameters<typeof spawn>[2], 'shell' | 'stdio'> & {
  /**
   * @description If true then will pipe stdout and stderr of the spawned shell to console.
   * @default true
   */
  log?: boolean;
};

/** Runs a shell command and returns the output. If the command fails, then an error is returned. */
export function sh(command: string, options: ShellCommandOptions = {}): Promise<Error | string> {
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
}
