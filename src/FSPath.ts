import { sep } from 'path';

// TODO:
export class FSPath {
  constructor(public readonly path: string[]) { }

  get full() {
    return this.path.join(sep);
  }
}

export function fspath(path: string | string[]): FSPath {
  if (typeof path === 'string') return new FSPath(path.split(sep));
  return new FSPath(path);
}