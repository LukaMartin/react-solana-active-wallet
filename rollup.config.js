const packageJson = require('./package.json');
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
            }
        ],
        plugins: [
            peerDepsExternal(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            resolve(),
            terser(),
            json(),
        ],
        external: ['react', 'react-dom'],
    },
    {
        input: 'src/index.ts',
        output: [{ file: packageJson.types }],
        plugins: [dts.default()],
    }
]