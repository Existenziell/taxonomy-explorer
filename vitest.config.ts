import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(process.cwd()) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
    },
  },
})
