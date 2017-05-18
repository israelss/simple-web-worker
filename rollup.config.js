import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
    filesize()
  ],
  dest: 'dist/sww.min.js',
  sourceMap: true
}
