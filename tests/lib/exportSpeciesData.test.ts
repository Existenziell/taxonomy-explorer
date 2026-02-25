import { describe, it, expect } from 'vitest'
import { getExportRow, getExportRows, EXPORT_HEADERS } from '@/lib/exportSpeciesData'
import type { SpeciesCountResult } from '@/types'

const minimalSpecies = (overrides: Partial<SpeciesCountResult> = {}): SpeciesCountResult => ({
  taxon: {
    id: 1,
    name: 'Quercus alba',
    preferred_common_name: 'white oak',
    iconic_taxon_name: 'Plantae',
    conservation_status: undefined,
    wikipedia_url: null,
    default_photo: null,
  },
  count: 42,
  ...overrides,
})

describe('exportSpeciesData', () => {
  describe('EXPORT_HEADERS', () => {
    it('has expected column names', () => {
      expect(EXPORT_HEADERS).toEqual([
        'Name',
        'Latin Name',
        'Taxonomy',
        'Observations',
        'Status',
        'Wikipedia Link',
        'Photo',
      ])
    })
  })

  describe('getExportRow', () => {
    it('returns row with Name, Latin Name, Taxonomy, Observations, Status, Wikipedia Link, Photo', () => {
      const row = getExportRow(minimalSpecies())
      expect(row).toHaveLength(7)
      expect(row[0]).toBe('White Oak')
      expect(row[1]).toBe('Quercus alba')
      expect(row[2]).toBe('Plantae')
      expect(row[3]).toBe('42')
      expect(row[4]).toBe('No data')
      expect(row[5]).toBe('')
      expect(row[6]).toBe('')
    })

    it('uses status translation when conservation_status is set', () => {
      const row = getExportRow(
        minimalSpecies({
          taxon: {
            ...minimalSpecies().taxon,
            conservation_status: { status_name: 'amenazada' },
          },
        })
      )
      expect(row[4]).toBe('Threatened')
    })

    it('uses wikipedia_url and default_photo when present', () => {
      const row = getExportRow(
        minimalSpecies({
          taxon: {
            ...minimalSpecies().taxon,
            wikipedia_url: 'https://en.wikipedia.org/wiki/Oak',
            default_photo: { medium_url: 'https://example.com/photo.jpg' },
          },
        })
      )
      expect(row[5]).toBe('https://en.wikipedia.org/wiki/Oak')
      expect(row[6]).toBe('https://example.com/photo.jpg')
    })
  })

  describe('getExportRows', () => {
    it('first row is headers, then one row per species', () => {
      const species = [minimalSpecies(), minimalSpecies({ taxon: { ...minimalSpecies().taxon, name: 'Quercus rubra' }, count: 10 })]
      const rows = getExportRows(species)
      expect(rows[0]).toEqual([...EXPORT_HEADERS])
      expect(rows).toHaveLength(3)
      expect(rows[1][1]).toBe('Quercus alba')
      expect(rows[2][1]).toBe('Quercus rubra')
    })

    it('returns only headers for empty species array', () => {
      const rows = getExportRows([])
      expect(rows).toHaveLength(1)
      expect(rows[0]).toEqual([...EXPORT_HEADERS])
    })
  })
})
