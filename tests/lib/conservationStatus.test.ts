import { describe, it, expect } from 'vitest'
import { isTaxonThreatened } from '@/lib/conservationStatus'
import type { Taxon } from '@/types'

function taxon(overrides: Partial<Taxon> = {}): Taxon {
  return {
    id: 1,
    name: 'Test',
    preferred_common_name: null,
    iconic_taxon_name: 'Insecta',
    ...overrides,
  }
}

describe('isTaxonThreatened', () => {
  it('returns false for taxon with status "secure"', () => {
    expect(isTaxonThreatened(taxon({ conservation_status: { status_name: 'secure' } }))).toBe(false)
  })

  it('returns false for taxon with status "Least Concern"', () => {
    expect(isTaxonThreatened(taxon({ conservation_status: { status_name: 'Least Concern' } }))).toBe(false)
  })

  it('returns false when conservation_status has no status_name', () => {
    expect(isTaxonThreatened(taxon({ conservation_status: {} }))).toBe(false)
    expect(isTaxonThreatened(taxon({}))).toBe(false)
  })

  it('returns true for taxon with status "Endangered"', () => {
    expect(isTaxonThreatened(taxon({ conservation_status: { status_name: 'Endangered' } }))).toBe(true)
  })

  it('returns true for taxon with status "Vulnerable"', () => {
    expect(isTaxonThreatened(taxon({ conservation_status: { status_name: 'Vulnerable' } }))).toBe(true)
  })

  it('returns true when extinct', () => {
    expect(isTaxonThreatened(taxon({ extinct: true }))).toBe(true)
  })

  it('returns true when conservation_statuses has IUCN >= 30', () => {
    expect(
      isTaxonThreatened(taxon({ conservation_statuses: [{ iucn: 40, status_name: 'Endangered' }] }))
    ).toBe(true)
  })

  it('returns false when conservation_statuses has only IUCN < 30', () => {
    expect(
      isTaxonThreatened(taxon({ conservation_statuses: [{ iucn: 10, status_name: 'Least Concern' }] }))
    ).toBe(false)
  })
})
