import type { ArgumentParser, ArgumentOptions } from 'argparse';
import { nodeOnly } from './misc';

export type AddArgumentParams =
  | [arg: string, options?: ArgumentOptions]
  | [arg1: string, arg2: string, options?: ArgumentOptions];

export const parseArgs = nodeOnly(
  <T = unknown>(
    constructorParams: ConstructorParameters<typeof ArgumentParser>[0],
    ...args: AddArgumentParams[]
  ): T => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const parser = new (require('argparse').ArgumentParser)(constructorParams);
    // @ts-ignore
    for (const arg of args) parser.add_argument(...arg);
    return parser.parse_args();
  },
);
