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
      external: ['dayjs'],
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
