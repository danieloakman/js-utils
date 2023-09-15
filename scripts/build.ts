#! bun

import { parseArgs } from '../src';

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

  const output = await Bun.build({
    minify: true,
    entrypoints: ['src'],
    outdir: '.',
    splitting: true,
    target: args.target,
  });
  console.log(output);
}
