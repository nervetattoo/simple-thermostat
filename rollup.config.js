import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'

export default {
  input: 'simple-thermostat.js',
  output: {
    file: 'simple-thermostat.min.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [
    replace({
      'https://unpkg.com/@polymer/polymer/lib/utils/debounce':
        '@polymer/polymer/lib/utils/debounce',
    }),
    resolve(),
    terser(),
  ],
}
