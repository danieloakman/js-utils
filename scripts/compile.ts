#! bun

import { join } from 'path';
import { iife, ok, parseArgs, sh } from '../src';
import { readdirDeep } from 'more-node-fs';

const esmToCjs = iife(
  ({ transformSync } = require('@babel/core')) =>
    (code: string): string =>
      ok(
        transformSync(code, {
          plugins: ['@babel/plugin-transform-modules-commonjs'],
        }),
      )?.code,
);

if (Bun.main === import.meta.path) {
  const args: { target: 'node' | 'browser' } = parseArgs(
    { description: 'Bundle using Bun and create declaration files with `tsc`.' },
    [
      'target',
      {
        choices: ['node', 'browser'],
      },
    ],
    [
      '--format',
      '-f',
      {
        choices: ['cjs', 'esm'],
        default: 'esm',
      },
    ],
  );

  const [srcFiles] = await Promise.all([
    (await readdirDeep(join(import.meta.dir, '../src'))).files,
    await sh('bun clean').then(ok),
  ]);

  // Build types only:
  ok(await sh('tsc -p tsconfig.types.json'));

  // Build
  const { outputs } = await Bun.build({
    minify: true,
    entrypoints: srcFiles,
    outdir: '.',
    splitting: true,
    // TODO: once bun supports cjs as a format, then put args.format here. For now babel is being used to transpile to cjs.
    format: 'esm',
    target: args.target,
    define: {
      'Bun.env.COMPILE_TARGET': `'${args.target}'`,
    },
  });

  for (const output of outputs) {
    const transpiled = esmToCjs(await output.text()).replaceAll('import.meta.require', 'require');
    await Bun.write(output.path, transpiled);
  }
}
