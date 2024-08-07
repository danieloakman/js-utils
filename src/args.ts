import type { ArgumentOptions, ArgumentParser } from 'argparse';

import { raise } from './functional';

export type AddArgumentParams =
  | [arg: string, options?: ArgumentOptions]
  | [arg1: string, arg2: string, options?: ArgumentOptions]
  | [arg1: string];

export const parseArgs: <T = unknown>(
  constructorParams: ConstructorParameters<typeof ArgumentParser>[0],
  ...args: AddArgumentParams[]
) => T =
  Bun.env.RUNTIME === 'node' || Bun.env.RUNTIME === 'bun'
    ? (constructorParams, ...args) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const parser = new (require('argparse').ArgumentParser)(constructorParams);
        // @ts-ignore
        for (const arg of args) parser.add_argument(...arg);
        return parser.parse_args();
      }
    : () => raise("Can't parse args in browser.");
