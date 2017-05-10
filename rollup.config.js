import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify(),
    filesize()
  ],
  dest: 'dist/sww.min.js', // equivalent to --output
  sourceMap: true
}
