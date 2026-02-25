import { describe, it, expect } from 'vitest'
import { sortSpeciesResults } from '@/lib/sortSpeciesResults'
import type { SpeciesCountResult } from '@/types'

function item(name: string, common: string | null, count: number): SpeciesCountResult {
  return {
    taxon: {
      id: 0,
      name,
      preferred_common_name: common,
      iconic_taxon_name: 'Animalia',
    },
    count,
  }
}

describe('sortSpeciesResults', () => {
  const input = [
    item('Zebra mus', 'Zebra', 10),
    item('Alpha beta', 'Alpha', 100),
    item('Beta gamma', null, 50),
  ]

  it('count_desc returns array unchanged (API order)', () => {
    const result = sortSpeciesResults(input, 'count_desc')
    expect(result).toEqual(input)
  })

  it('count_asc sorts by count ascending', () => {
    const result = sortSpeciesResults(input, 'count_asc')
    expect(result.map((r) => r.count)).toEqual([10, 50, 100])
  })

  it('name_asc sorts by preferred_common_name then name', () => {
    const result = sortSpeciesResults(input, 'name_asc')
    expect(result.map((r) => r.taxon.preferred_common_name ?? r.taxon.name)).toEqual([
      'Alpha',
      'Beta gamma',
      'Zebra',
    ])
  })

  it('name_desc sorts by name descending', () => {
    const result = sortSpeciesResults(input, 'name_desc')
    expect(result.map((r) => r.taxon.preferred_common_name ?? r.taxon.name)).toEqual([
      'Zebra',
      'Beta gamma',
      'Alpha',
    ])
  })

  it('does not mutate original array', () => {
    const copy = [...input]
    sortSpeciesResults(input, 'count_asc')
    expect(input).toEqual(copy)
  })
})
