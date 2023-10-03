import type { ArgumentParser, ArgumentOptions } from 'argparse';
export type AddArgumentParams = [arg: string, options?: ArgumentOptions] | [arg1: string, arg2: string, options?: ArgumentOptions] | [arg1: string];
export declare const parseArgs: <T = unknown>(constructorParams: ConstructorParameters<typeof ArgumentParser>[0], ...args: AddArgumentParams[]) => T;
