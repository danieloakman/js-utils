import { existsSync, statSync } from 'fs';
import { sep, join } from 'path';
import { once, safeCall } from './functional';

export class FSPath {
  readonly stats = once(() => safeCall(() => statSync(this.full())));
  readonly full = once(() => join(...this.path));
  readonly exists = once(() => existsSync(this.full()));

  constructor(private readonly path: string[]) {}

  [Symbol.iterator]() {
    return this.path[Symbol.iterator]();
  }

  toString() {
    return this.full();
  }

  pop(): FSPath {
    return new FSPath(this.path.slice(0, -1));
  }

  push(...paths: string[]): FSPath {
    return new FSPath([...this.path, ...paths]);
  }

  shift(): FSPath {
    return new FSPath(this.path.slice(1));
  }

  unshift(): FSPath {
    return new FSPath(this.path.slice(0, 1));
  }

  slice(start: number, end?: number): FSPath {
    return new FSPath(this.path.slice(start, end));
  }

  splice(start: number, deleteCount?: number, ...items: string[]): FSPath {
    return new FSPath(this.path.splice(start, deleteCount as number, ...items));
  }
}

export function fspath(...args: string[]): FSPath {
  if (args.length === 1) return new FSPath(args[0].split(sep).filter(Boolean));
  return new FSPath(args);
}
