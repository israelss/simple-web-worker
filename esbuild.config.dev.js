import esbuild from 'esbuild'

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/index.js'],
    outfile: 'dist/sww.min.js',
    sourcemap: true,
    watch: true
  })
  .then((_) => console.log('watching...'))
  .catch(() => process.exit(1))
