import { describe, it, expect } from 'vitest'
import { SITE_TITLE, siteMetadata } from '@/lib/metadata'

describe('metadata', () => {
  it('exports SITE_TITLE as "Taxonomy Explorer"', () => {
    expect(SITE_TITLE).toBe('Taxonomy Explorer')
  })

  it('siteMetadata has expected shape', () => {
    expect(siteMetadata.title).toBe(SITE_TITLE)
    expect(siteMetadata.description).toBe('Browse and explore species taxonomy from iNaturalist.')
    expect(siteMetadata.icons).toBeDefined()
    expect(siteMetadata.icons?.icon).toBeDefined()
    expect(Array.isArray(siteMetadata.icons?.icon)).toBe(true)
    expect(siteMetadata.icons?.apple).toBe('/favicon/apple-touch-icon.png')
    expect(siteMetadata.other).toBeDefined()
    expect(siteMetadata.other?.['theme-color']).toBe('#242424')
  })
})
