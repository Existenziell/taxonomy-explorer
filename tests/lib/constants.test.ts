import { describe, it, expect } from 'vitest'
import {
  DEFAULT_PER_PAGE,
  MIN_SEARCH_LENGTH,
  getEffectiveSearch,
  SPECIES_COUNTS_BASE_URL,
  PLACES_AUTOCOMPLETE_BASE_URL,
  PAGE_PARAM,
  SEARCH_PARAM,
  ORDER_PARAM,
  WORLD_PLACE_ID,
  DEFAULT_PLACE_ID,
  FALLBACK_REGIONS,
  SCROLL_TO_TOP_THRESHOLD,
  VALID_ORDER,
  SPECIES_CLASS_OPTIONS,
  VALID_TAXON,
} from '@/lib/constants'

describe('constants', () => {
  it('exports pagination/search defaults', () => {
    expect(DEFAULT_PER_PAGE).toBe(50)
    expect(MIN_SEARCH_LENGTH).toBe(2)
  })

  it('getEffectiveSearch returns search when length >= MIN_SEARCH_LENGTH', () => {
    expect(getEffectiveSearch('ab')).toBe('ab')
    expect(getEffectiveSearch('hello')).toBe('hello')
  })

  it('getEffectiveSearch returns empty string when too short', () => {
    expect(getEffectiveSearch('')).toBe('')
    expect(getEffectiveSearch('a')).toBe('')
  })

  it('exports VALID_ORDER and taxon options', () => {
    expect(VALID_ORDER).toContain('count_desc')
    expect(SPECIES_CLASS_OPTIONS).toContain('all')
    expect(VALID_TAXON.has('aves')).toBe(true)
  })

  it('exports API base URLs', () => {
    expect(SPECIES_COUNTS_BASE_URL).toContain('inaturalist.org')
    expect(SPECIES_COUNTS_BASE_URL).toContain('species_counts')
    expect(PLACES_AUTOCOMPLETE_BASE_URL).toContain('places/autocomplete')
  })

  it('exports URL param names', () => {
    expect(PAGE_PARAM).toBe('page')
    expect(SEARCH_PARAM).toBe('q')
    expect(ORDER_PARAM).toBe('order')
  })

  it('exports place IDs', () => {
    expect(WORLD_PLACE_ID).toBe(1)
    expect(DEFAULT_PLACE_ID).toBe(7354)
  })

  it('exports FALLBACK_REGIONS as non-empty array of { id, name }', () => {
    expect(Array.isArray(FALLBACK_REGIONS)).toBe(true)
    expect(FALLBACK_REGIONS.length).toBeGreaterThan(0)
    FALLBACK_REGIONS.forEach((r) => {
      expect(typeof r.id).toBe('number')
      expect(typeof r.name).toBe('string')
    })
  })

  it('exports SCROLL_TO_TOP_THRESHOLD', () => {
    expect(SCROLL_TO_TOP_THRESHOLD).toBe(800)
  })
})
