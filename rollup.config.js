import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'index.js',
  output: {
    file: 'simple-thermostat.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [resolve(), terser()],
}
