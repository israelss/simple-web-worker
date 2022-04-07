import esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel'

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/index.js'],
    minify: true,
    target: ['es5'],
    outfile: 'dist/sww.min.js',
    plugins: [babel()]

  })
  .then((result) => {
    if (result.warnings) {
      result.warnings.forEach((warn) => console.warn(warn))
    }
    console.info('Built `dist/sww.min.js` with success!')
  })
  .catch(() => process.exit(1))
