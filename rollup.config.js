import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postCSS from 'rollup-plugin-postcss'
import postCSSLit from 'rollup-plugin-postcss-lit'
import postCSSPresetEnv from 'postcss-preset-env'
import inject from 'rollup-plugin-inject-process-env'

const shared = (DEBUG) => [
  resolve({
    browser: true,
  }),
  commonjs(),
  json(),
  inject(
    {
      DEBUG,
    },
    { exclude: '**/*.css' }
  ),
  typescript(),
  postCSS({
    plugins: [
      postCSSPresetEnv({
        stage: 1,
        features: {
          'nesting-rules': true,
          'custom-media-queries': true,
        },
      }),
    ],
    inject: true,
    extract: false,
  }),
  postCSSLit(),
]

export default [
  {
    input: 'src/simple-thermostat.ts',
    output: {
      file: 'dist/simple-thermostat.js',
      format: 'es',
      name: 'SimpleThermostat',
    },
    plugins: [
      ...shared(false),
      terser({
        output: {
          comments: false,
        },
      }),
    ],
  },
  {
    input: 'src/simple-thermostat.ts',
    output: {
      file: 'dist/simple-thermostat.debug.js',
      format: 'es',
      name: 'SimpleThermostat',
    },
    plugins: shared(true),
  },
]
