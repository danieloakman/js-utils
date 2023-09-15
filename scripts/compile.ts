#! bun

import { join } from 'path';
import { parseArgs } from '../src';
import { readdirDeep } from 'more-node-fs';

if (Bun.main === import.meta.path) {
  const args: { target: 'node' | 'browser' } = parseArgs(
    { description: 'Bundle using Bun and create declaration files with `tsc`.' },
    [
      'target',
      {
        choices: ['node', 'browser'],
      },
    ],
  );

  const srcFiles = (await readdirDeep(join(import.meta.dir, '../src'))).files;

  // Bun.env.COMPILE_TARGET = args.target;

  const output = await Bun.build({
    minify: true,
    entrypoints: srcFiles,
    outdir: '.',
    splitting: true,
    target: args.target,
    define: {
      'Bun.env.COMPILE_TARGET': `'${args.target}'`,
    },
    sourcemap: 'inline',
  });
  console.log(output);
}
