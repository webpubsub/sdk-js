import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { basename, dirname, join } from 'path';
import gzipPlugin from 'rollup-plugin-gzip';
import { terser } from 'rollup-plugin-terser';
import { browser, version } from './package.json';
import tsConfig from './tsconfig.rollup.json';




export default [
  {
    input: 'src/web/index.js',
    output: {
      file: browser,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig), terser()],
  },
  {
    input: 'src/web/index.js',
    output: {
      file: join(dirname(browser), basename(browser, '.min.js') + '.js'),
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig)],
  },
  {
    input: 'src/web/index.js',
    output: {
      file: `upload/gzip/webpubsub.${version}.min.js`,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [
      json(),
      resolve({ browser: true }),
      commonjs(),
      typescript(tsConfig),
      terser(),
      gzipPlugin({ fileName: '' }),
    ],
  },
  {
    input: 'src/web/index.js',
    output: {
      file: `upload/gzip/webpubsub.${version}.js`,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig), gzipPlugin({ fileName: '' })],
  },
  {
    input: 'src/web/index.js',
    output: {
      file: `upload/normal/webpubsub.${version}.min.js`,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig), terser()],
  },
  {
    input: 'src/web/index.js',
    output: {
      file: `upload/normal/webpubsub.${version}.js`,
      format: 'umd',
      name: 'Webpubsub',
    },
    plugins: [json(), resolve({ browser: true }), commonjs(), typescript(tsConfig)],
  },
];
