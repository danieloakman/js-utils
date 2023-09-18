#! bun
import { join, relative } from 'path';
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

  const [srcFiles] = await Promise.all([
    readdirDeep(join(import.meta.dir, '../src'), { ignore: /\.test\.ts$/ }).then(({ files }) => files),
    clean(),
  ]);

  // Build types only:
  // ok(await sh('bunx tsc -p tsconfig.types-only.json'));

  // Build types and JS with typescript first.
  // This is mainly to create the type declaration files, but also to fill in for any js files that bun doesn't include.
  ok(await sh(`bunx tsc -p tsconfig.${args.format}.json`));

  // Build
  const buildResult = await Bun.build({
    minify: true,
    entrypoints: srcFiles as string[],
    outdir: '.',
    splitting: true,
    external: ['arg-parse'],
    // TODO: once bun supports cjs as a format, then put args.format here. For now babel is being used to transpile to cjs.
    format: 'esm',
    target: args.target,
    root: './src',
    define: {
      'Bun.env.RUNTIME': `'${args.target}'`,
      'parseArgs': '() => { throw new Error("Can\'t parse args in browser.") }',
    },
  });

  if (buildResult.logs.length) console.log(buildResult.logs);

  if (!buildResult.success) process.exit(1);
  else
    console.log(
      'Compiled:',
      await readdirDeep(process.cwd(), { ignore: /node_modules/ }).then(({ files }) =>
        files.filter(v => v.endsWith('.js')).map(v => relative(process.cwd(), v)),
      ),
      // buildResult.outputs.map(v => relative(process.cwd(), v.path)),
    );

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
