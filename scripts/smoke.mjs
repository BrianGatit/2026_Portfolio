import { createServer } from 'vite'

/**
 * Runs the render smoke test through Vite's SSR module loader, so the pages are
 * transformed exactly as the app transforms them (path aliases, TSX, CSS
 * imports) without needing a browser.
 *
 *   npm run smoke
 */
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
})

try {
  const { runSmoke } = await server.ssrLoadModule('/scripts/smoke-entry.tsx')
  const results = runSmoke()

  let failed = 0
  for (const result of results) {
    if (result.ok) {
      console.log(`  ok    ${result.path.padEnd(42)} ${String(result.bytes).padStart(7)} bytes`)
    } else {
      failed += 1
      console.log(`  FAIL  ${result.path.padEnd(42)} ${result.notes.join(' · ')}`)
    }
  }

  console.log(`\n${results.length - failed}/${results.length} routes rendered cleanly`)
  process.exitCode = failed > 0 ? 1 : 0
} catch (error) {
  console.error('smoke run failed:', error)
  process.exitCode = 1
} finally {
  await server.close()
}
