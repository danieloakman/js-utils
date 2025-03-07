import { alwaysRaise } from './functional';

/** @deprecated Just import the `meow` package instead, as it's type safe. This will be removed soon. */
export type AddArgumentParams = unknown;

/** @deprecated Just import the `meow` package instead, as it's type safe. This will be removed soon. */
export const parseArgs: <T = unknown>(constructorParams: unknown, ...args: AddArgumentParams[]) => T =
  Bun.env.RUNTIME === 'node' || Bun.env.RUNTIME === 'bun'
    ? (constructorParams, ...args) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const parser = new (require('argparse').ArgumentParser)(constructorParams);
        // @ts-ignore
        for (const arg of args) parser.add_argument(...arg);
        return parser.parse_args();
      }
    : alwaysRaise("Can't parse args in browser.");
