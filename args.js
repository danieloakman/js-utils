"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = void 0;
const _1 = require(".");
exports.parseArgs = Bun.env.RUNTIME === 'node' || Bun.env.RUNTIME === 'bun'
    ? (constructorParams, ...args) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const parser = new (require('argparse').ArgumentParser)(constructorParams);
        // @ts-ignore
        for (const arg of args)
            parser.add_argument(...arg);
        return parser.parse_args();
    }
    : () => (0, _1.raise)("Can't parse args in browser.");
