import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'simple-thermostat.js',
  output: {
    file: 'simple-thermostat.min.js',
    format: 'umd',
    name: 'SimpleThermostat',
  },
  plugins: [resolve(), terser()],
}
