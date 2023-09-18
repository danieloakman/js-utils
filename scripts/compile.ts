#! bun
import { join } from 'path';
import { iife, ok, parseArgs, pipe, sh } from '../src';
import { readdirDeep } from 'more-node-fs';
import { minify } from 'uglify-js';
import { clean } from './clean';

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
  const args: { target: 'node' | 'browser' | 'bun'; format: 'esm' | 'cjs' } = parseArgs(
    { description: 'Bundle using Bun and create declaration files with `tsc`.' },
    [
      'target',
      {
        choices: ['node', 'browser', 'bun'],
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

  // Copy .env.example to .env if it doesn't exist:
  if (!(await Bun.file(join(import.meta.dir, '../.env')).exists())) await sh('cp .env.example .env');

  const [srcFiles] = await Promise.all([
    readdirDeep(join(import.meta.dir, '../src'), { ignore: /\.test\.ts$/ }).then(v => v.files),
    clean(),
  ]);

  // Build types only:
  // console.log('Building types...');
  ok(await sh('bunx tsc -p tsconfig.types.json'));

  // console.log({ srcFiles });

  // Build
  // console.log('Building JS with Bun...');
  const buildResult = await Bun.build({
    minify: true,
    entrypoints: srcFiles,
    outdir: '.',
    splitting: true,
    // TODO: once bun supports cjs as a format, then put args.format here. For now babel is being used to transpile to cjs.
    format: 'esm',
    target: args.target,
    root: './src',
    define: {
      'Bun.env.RUNTIME': `'${args.target}'`,
    },
  });

  if (!buildResult.success) {
    console.error(buildResult.logs);
    process.exit(1);
  }

  if (args.format === 'cjs') {
    // Transpile to cjs:
    for (const output of buildResult.outputs) {
      const transpiled = pipe(
        await output.text(),
        esmToCjs,
        str => str.replaceAll('import.meta.require', 'require'),
        minify,
        ok,
        v => v.code,
      );
      await Bun.write(output.path, transpiled);
    }
  }
}
