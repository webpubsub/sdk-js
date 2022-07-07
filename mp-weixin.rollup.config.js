import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { mpweixin } from './package.json';
import tsConfig from './tsconfig.rollup.json';


export default [
  {
    input: 'src/mp-weixin/index.js',
    output: {
      file: mpweixin,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig), terser()],
  }
];
