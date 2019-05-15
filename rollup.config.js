import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'simple-thermostat.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [resolve(), commonjs(), terser(), filesize()],
}
