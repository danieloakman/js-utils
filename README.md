[![Test](https://github.com/danieloakman/js-utils/actions/workflows/test.yml/badge.svg)](https://github.com/danieloakman/js-utils/actions/workflows/test.yml) [![Release](https://github.com/danieloakman/js-utils/actions/workflows/release.yml/badge.svg)](https://github.com/danieloakman/js-utils/actions/workflows/release.yml)

# js-utils

My assortment of common utils that I've grown tired of copy pasting to every repo I create.

The build process bundles all dependencies in with the built javascript (since the build uses esbuild which is a bundler). This allows this package to have no dependencies when installed since they will already be present. For this reason, it's important to keep aware of what files are including external dependencies.

## Development

1. Install [Bun](https://bun.sh/)
2. Install dependencies: `bun i`
3. Build: `bun run build`

## Release

`bun v:patch` or `bun v:minor` or `bun v:major`
This will bump the package version, create a git tag, and run the release Github workflow.

## Install

### From Github releases

`pnpm add https://github.com/danieloakman/js-utils/releases/download/vx.x.x/package.tgz`

`pnpm add https://github.com/danieloakman/js-utils/releases/latest/download/package.tgz`
