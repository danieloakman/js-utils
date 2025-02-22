#! bun
import { attempt, Fn, ok, Result } from '../src';
import { $ } from 'bun';
import { build as esbuild } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { copyFile } from 'fs/promises';
import { globIterateSync } from 'glob';
import { iter } from 'iteragain';
import { join, relative } from 'path';
import { transformSync } from '@babel/core';

export const esmToCjs = (code: string): string => {
  return ok(
    // @ts-expect-error
    attempt(() =>
      (transformSync as Fn)(code, {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      }),
    ),
    // @ts-expect-error
  )?.code;
};

export interface BuildArgs {
  target: 'node' | 'browser' | 'bun';
  format: 'esm' | 'cjs';
  outdir: string;
}

export async function build(args: BuildArgs): Promise<Result<boolean>> {
  const srcFiles = iter(globIterateSync(join(import.meta.dir, '../src/**/*.ts')))
    .filter(path => !path.endsWith('test.ts'))
    .toArray();
  const tsconfig = join(import.meta.dir, `../tsconfig.${args.format}.json`);
  const distPath = join(import.meta.dir, '../dist');

  if (args.target === 'bun') {
    const outdir = join(distPath, args.outdir);
    const buildResult = await Bun.build({
      ...args,
      entrypoints: srcFiles,
      outdir,
      sourcemap: 'external',
      format: args.format,
      target: args.target,
      minify: true,
      root: './src',
      splitting: true,
      define: {
        'Bun.env.RUNTIME': `'${args.target}'`,
      },
    });
    if (!buildResult.success) {
      console.error(buildResult.logs.map(v => v.message).join('\n'));
      return Result.Error(new Error(`Build for ${args.outdir} failed.`));
    }
    if (buildResult.logs.length) {
      let level: 'warn' | 'log' | 'error' | 'debug' = 'log';
      const logs = iter(buildResult.logs)
        .tap(log => {
          if (log.level === 'error') level = 'error';
          else if (log.level === 'warning' && level !== 'error') level = 'warn';
          else if (log.level === 'debug' && level !== 'warn') level = 'debug';
        })
        .map(v => v.message)
        .join('\n');
      console[level](logs);
    }

    // Copy declaration files:
    console.log(join(distPath, 'types'));
    await iter(globIterateSync(join(distPath, 'types') + '/*'))
      .tap(console.log)
      .map(src => {
        const relativePath = relative(join(distPath, 'types'), src);
        console.log(relativePath);
        return copyFile(src, join(outdir, relativePath));
      })
      .promiseAll();
  } else {
    const buildResult = await esbuild({
      // entryPoints: [join(import.meta.dir, '../src/index.ts')],
      entryPoints: srcFiles,
      outdir: `./dist/${args.outdir}`,
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
      return Result.Error(new Error(`Build for ${args.outdir} failed.`));
    }
    if (buildResult.warnings.length) console.warn(buildResult.warnings);
  }

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
  //     'Bun.env[\'RUNTIME\']': `'${args.target}'`,
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

  return Result.Ok(true);
}

if (import.meta.main) {
  await $`rm -rf dist`;
  await $`tsc -p tsconfig.types.json`;

  await iter([
    { target: 'node', format: 'cjs', outdir: 'node-cjs' },
    { target: 'browser', format: 'esm', outdir: 'browser' },
    { target: 'bun', format: 'esm', outdir: 'bun' },
  ] satisfies BuildArgs[])
    .map(args => build(args).then(ok))
    .promiseAll();
}
