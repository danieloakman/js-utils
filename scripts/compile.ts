#! bun
import { join } from 'path';
import { iife, ok, parseArgs } from '../src';
import { readdirDeep } from 'more-node-fs';
import { clean } from './clean';
import { build } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

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

  if (args.target === 'bun') return new Error('Bun target is no longer supported, use browser instead.');

  const tsconfig = join(import.meta.dir, `../tsconfig.${args.format}.json`);

  const buildResult = await build({
    // entryPoints: [join(import.meta.dir, '../src/index.ts')],
    entryPoints: srcFiles,
    outdir: '.',
    sourceRoot: './src',
    sourcemap: 'linked',
    // minify: true,
    minifyWhitespace: false,
    minifySyntax: true,
    minifyIdentifiers: false,
    platform: args.target,
    format: args.format,
    treeShaking: true,
    splitting: args.format === 'esm',
    bundle: true,
    // external: ['argparse'],
    define: {
      'Bun.env.RUNTIME': `'${args.target}'`,
    },
    tsconfig,
    plugins: [dtsPlugin({ tsconfig })],
  });

  if (buildResult.errors.length) {
    console.error(buildResult.errors);
    return new Error('Build failed.');
  }
  if (buildResult.warnings.length) console.warn(buildResult.warnings);

  // Build types only:
  // ok(await sh('bunx tsc -p tsconfig.types-only.json'));

  // Build types and index.js with typescript first to create the declaration files:
  // ok(await sh(`bunx tsc -p tsconfig.${args.format}.json --emitDeclarationOnly`));

  // Include the declaration files in the build and make sure that the index.js file is in there:
  // ok(await sh(`bunx tsc -p tsconfig.${args.format}.json`));
  // for await (const { path, stats } of walkdir(join(import.meta.dir, '../'), { ignore: /node_modules/i })) {
  //   if (!stats.isFile() || !path.endsWith('.js')) continue;
  //   // Remove all js files except index.js:
  //   if (!path.endsWith('index.js')) await rm(path);
  // }

  // const buildResult = await Bun.build({
  //   minify: false,
  //   // If bundling into one index.js:
  //   // entrypoints: [join(import.meta.dir, '../src/index.ts')],
  //   entrypoints: srcFiles,
  //   outdir: '.',
  //   splitting: true,
  //   external: ['arg-parse'],
  //   // TODO: once bun supports cjs as a format, then put args.format here. For now babel is being used to transpile to cjs.
  //   format: 'esm',
  //   target: args.target,
  //   root: './src',
  //   // sourcemap: 'external',
  //   define: {
  //     'Bun.env.RUNTIME': `'${args.target}'`,
  //     'parseArgs': '() => { throw new Error("Can\'t parse args in browser.") }',
  //   },
  // });

  // if (buildResult.logs.length) console.log(buildResult.logs);

  // if (!existsSync(join(import.meta.dir, '../index.js')))
  //   return new Error('Build did not contain `index.js` file, aborting.');

  // if (!buildResult.success) return new Error('Build failed.');

  // // Add empty js files for all ts files that were not compiled:
  // const srcdir = join(import.meta.dir, '../src');
  // for (const srcFile of srcFiles) {
  //   const expectedJsFile = relative(srcdir, srcFile.replace(/\.ts$/, '.js'));
  //   if (!existsSync(expectedJsFile)) {
  //     await Bun.write(expectedJsFile, '');
  //     // return new Error(`Build did not contain ${expectedJsFile}`);
  //   }
  // }

  // console.log(
  //   'Compiled:',
  //   await readdirDeep(process.cwd(), { ignore: /node_modules/ }).then(({ files }) =>
  //     files.filter(v => v.endsWith('.js')).map(v => relative(process.cwd(), v)),
  //   ),
  // );

  // /** Up to date file text contents. Because buildResult.outputs *could* contain an out of date blob. */
  // const buildOutputs = buildResult.outputs.map(v => ({ path: v.path, text: () => Bun.file(v.path).text() }));

  // // Post build processing and checks:
  // for (const output of buildOutputs) {
  //   const text = await output.text();
  //   const m = toArray(filterMap(matches(/export {[^}]+}/g, text), toMatch));
  //   // Remove all exports except the last one:
  //   if (m.length >= 2) {
  //     console.log('Found multiple exports in', output.path);
  //     const l = last(m) ?? raise('Could not find last');
  //     await Bun.write(output.path, stringSplice(text, l.start, l.length + 1));
  //   }
  // }

  // if (args.format === 'cjs') {
  //   // Transpile to cjs:
  //   for (const output of buildOutputs) {
  //     const transpiled = pipe(
  //       await output.text(),
  //       esmToCjs,
  //       str => str.replaceAll('import.meta.require', 'require'),
  //       // minify,
  //       // ok,
  //       // v => v.code,
  //     );
  //     await Bun.write(output.path, transpiled);
  //   }
  // }

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
