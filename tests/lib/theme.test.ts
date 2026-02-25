import { createRequire } from 'node:module'
import { describe, it, expect } from 'vitest'

const require = createRequire(import.meta.url)
const theme = require('../../lib/theme.js')

describe('theme', () => {
  it('exports colors with cta', () => {
    expect(theme.colors).toBeDefined()
    expect(theme.colors.cta).toBe('#D6A269')
  })

  it('exports mist scale 50-950', () => {
    expect(theme.mist).toBeDefined()
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    steps.forEach((step: number) => {
      expect(theme.mist[step]).toBeDefined()
      expect(typeof theme.mist[step]).toBe('string')
      expect(theme.mist[step]).toMatch(/oklch\(/)
    })
  })

  it('exports light and dark with keys 1-6', () => {
    expect(theme.light).toBeDefined()
    expect(theme.dark).toBeDefined()
    ;[1, 2, 3, 4, 5, 6].forEach((k: number) => {
      expect(theme.light[k]).toBeDefined()
      expect(theme.dark[k]).toBeDefined()
    })
  })
})
