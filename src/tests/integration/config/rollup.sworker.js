import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'

export default {
  entry: 'src/tests/integration/config/importSworker.js',
  dest: 'src/tests/integration/config/sworker.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    filesize()
  ]
}
