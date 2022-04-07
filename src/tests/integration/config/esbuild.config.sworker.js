import esbuild from 'esbuild'

esbuild
  .build({
    bundle: true,
    entryPoints: {
      sworker: 'src/tests/integration/config/importSworker.js'
    },
    outdir: 'src/tests/integration/config',
    platform: 'node',
    sourcemap: true
  })
  .catch(() => process.exit(1))
