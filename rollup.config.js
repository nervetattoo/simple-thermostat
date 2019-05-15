import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'index.js',
  output: {
    file: 'simple-thermostat.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [resolve(), terser(), filesize()],
}
