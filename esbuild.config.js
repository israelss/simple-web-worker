require('esbuild')
  .build({
    bundle: true,
    entryPoints: ['src/index.js'],
    outfile: 'dist/sww.min.js',
    sourcemap: true
  })
  .then((result) => {
    if (result.warnings) {
      result.warnings.forEach((warn) => console.warn(warn))
    }
    console.info('Built `dist/sww.min.js` with success!')
  })
  .catch(() => process.exit(1))
