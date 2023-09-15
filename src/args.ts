import { ArgumentParser, ArgumentOptions } from 'argparse';

export type AddArgumentParams =
  | [arg: string, options?: ArgumentOptions]
  | [arg1: string, arg2: string, options?: ArgumentOptions];

export function parseArgs<T = unknown>(
  constructorParams: ConstructorParameters<typeof ArgumentParser>[0],
  ...args: AddArgumentParams[]
): T {
  const parser = new ArgumentParser(constructorParams);
  // @ts-ignore
  for (const arg of args) parser.add_argument(...arg);
  return parser.parse_args();
}
