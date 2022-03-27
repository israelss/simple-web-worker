require('esbuild')
  .build({
    bundle: true,
    entryPoints: ['src/tests/integration/config/importSworker.js'],
    outfile: 'src/tests/integration/config/sworker.js',
    platform: 'node',
    sourcemap: true
  })
  .catch(() => process.exit(1))
