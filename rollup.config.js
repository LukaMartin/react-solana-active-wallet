const packageJson = require("./package.json");
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const nodeBuiltins = ['fs', 'path', 'http', 'https', 'stream', 'url', 'util', 'buffer', 'zlib', 'punycode'];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
      },
    ],
    external: [
      ...nodeBuiltins,
      'react',
      'rpc-websockets',
      // Add any other external dependencies here
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
  },
];
