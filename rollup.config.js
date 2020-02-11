import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import commonjs from '@rollup/plugin-commonjs'
import minifyHTML from 'rollup-plugin-minify-html-literals'
import json from 'rollup-plugin-json'
import postCSS from 'rollup-plugin-postcss'
import postCSSLit from 'rollup-plugin-postcss-lit'
import postCSSPresetEnv from 'postcss-preset-env'

export default {
  input: 'src/index.js',
  output: {
    file: 'simple-thermostat.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [
    resolve(),
    commonjs(),
    postCSS({
      plugins: [
        postCSSPresetEnv({
          stage: 1,
          features: {
            'nesting-rules': true,
            'custom-media-query': true,
          },
        }),
      ],
    }),
    postCSSLit(),
    json({ compact: true }),
    minifyHTML({
      options: {
        shouldMinifyCSS: () => false,
        minifyCSS: false,
      },
    }),
    terser({
      output: {
        comments: false,
      },
    }),
    filesize(),
  ],
}
