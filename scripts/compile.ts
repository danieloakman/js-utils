#! bun
import { join, relative } from 'path';
import { iife, ok, parseArgs, pipe, sh, matches, raise, stringSplice, toMatch } from '../src';
import { readdirDeep, walkdir } from 'more-node-fs';
import { clean } from './clean';
import { existsSync } from 'fs';
import { filterMap, toArray } from 'iteragain-es';
import { last } from 'lodash-es';
import { rm } from 'fs/promises';

export const esmToCjs = iife(
  ({ transformSync } = require('@babel/core')) =>
    (code: string): string =>
      ok(
        transformSync(code, {
          plugins: ['@babel/plugin-transform-modules-commonjs'],
        }),
      )?.code,
);

export interface CompileArgs {
  target: 'node' | 'browser' | 'bun';
  format: 'esm' | 'cjs';
}

export async function compile(args: CompileArgs): Promise<Error | boolean> {
  const [srcFiles] = await Promise.all([
    readdirDeep(join(import.meta.dir, '../src'), { ignore: /\.test\.ts$/ }).then(({ files }) => files),
    clean(),
  ]);

  // Build types only:
  // ok(await sh('bunx tsc -p tsconfig.types-only.json'));

  // Build types and index.js with typescript first, This is mainly to create the type declaration files, but also to
  // include the `index.js` which is sometimes not included.
  ok(await sh(`bunx tsc -p tsconfig.${args.format}.json`));
  for await (const { path, stats } of walkdir(join(import.meta.dir, '../'), { ignore: /node_modules/i })) {
    if (!stats.isFile() || !path.endsWith('.js')) continue;
    // Remove all js files except index.js:
    if (!path.endsWith('index.js')) await rm(path);
  }

  // Build
  const buildResult = await Bun.build({
    minify: false,
    entrypoints: srcFiles as string[],
    outdir: '.',
    splitting: true,
    external: ['arg-parse'],
    // TODO: once bun supports cjs as a format, then put args.format here. For now babel is being used to transpile to cjs.
    format: 'esm',
    target: args.target,
    root: './src',
    // sourcemap: 'external',
    define: {
      'Bun.env.RUNTIME': `'${args.target}'`,
      'parseArgs': '() => { throw new Error("Can\'t parse args in browser.") }',
    },
  });

  if (buildResult.logs.length) console.log(buildResult.logs);

  if (!existsSync(join(import.meta.dir, '../index.js')))
    return new Error('Build did not contain `index.js` file, aborting.');

  if (!buildResult.success) return new Error('Build failed.');

  console.log(
    'Compiled:',
    await readdirDeep(process.cwd(), { ignore: /node_modules/ }).then(({ files }) =>
      files.filter(v => v.endsWith('.js')).map(v => relative(process.cwd(), v)),
    ),
  );

  /** Up to date file text contents. Because buildResult.outputs *could* contain an out of date blob. */
  const buildOutputs = buildResult.outputs.map(v => ({ path: v.path, text: () => Bun.file(v.path).text() }));

  // Post build processing and checks:
  for (const output of buildOutputs) {
    const text = await output.text();
    const m = toArray(filterMap(matches(/export {[^}]+}/g, text), toMatch));
    // Remove all exports except the last one:
    if (m.length >= 2) {
      console.log('Found multiple exports in', output.path);
      const l = last(m) ?? raise('Could not find last');
      await Bun.write(output.path, stringSplice(text, l.start, l.length + 1));
    }
  }

  if (args.format === 'cjs') {
    // Transpile to cjs:
    for (const output of buildOutputs) {
      const transpiled = pipe(
        await output.text(),
        esmToCjs,
        str => str.replaceAll('import.meta.require', 'require'),
        // minify,
        // ok,
        // v => v.code,
      );
      await Bun.write(output.path, transpiled);
    }
  }

  return true;
}

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
  ok(await compile(args));
}
