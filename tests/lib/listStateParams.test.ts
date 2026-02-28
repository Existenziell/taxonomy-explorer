import { describe, it, expect } from 'vitest'
import {
  parseListStateFromSearchParams,
  buildListStateSearchParams,
  type ListStateParams,
} from '@/lib/listStateParams'
import { DEFAULT_PLACE_ID } from '@/lib/constants'

function params(record: Record<string, string>): { get: (name: string) => string | null } {
  return {
    get(name: string) {
      return record[name] ?? null
    },
  }
}

describe('parseListStateFromSearchParams', () => {
  it('uses defaults when searchParams are empty', () => {
    const result = parseListStateFromSearchParams(params({}))
    expect(result.placeId).toBe(DEFAULT_PLACE_ID)
    expect(result.page).toBe(1)
    expect(result.search).toBe('')
    expect(result.orderBy).toBe('count_desc')
    expect(result.filterEndemic).toBe(false)
    expect(result.filterThreatened).toBe(false)
    expect(result.filterSpeciesClass).toBe('')
    expect(result.filterTaxonId).toBe(null)
  })

  it('parses place_id, page, q, order, endemic, threatened, taxon, taxon_id', () => {
    const result = parseListStateFromSearchParams(
      params({
        place_id: '123',
        page: '3',
        q: 'oak',
        order: 'name_asc',
        endemic: 'true',
        threatened: 'true',
        taxon: 'aves',
        taxon_id: '47126',
      })
    )
    expect(result.placeId).toBe(123)
    expect(result.page).toBe(3)
    expect(result.search).toBe('oak')
    expect(result.orderBy).toBe('name_asc')
    expect(result.filterEndemic).toBe(true)
    expect(result.filterThreatened).toBe(true)
    expect(result.filterSpeciesClass).toBe('aves')
    expect(result.filterTaxonId).toBe(47126)
  })

  it('clamps place_id and page to at least 1', () => {
    expect(parseListStateFromSearchParams(params({ place_id: '0' })).placeId).toBe(1)
    expect(parseListStateFromSearchParams(params({ page: '0' })).page).toBe(1)
  })

  it('rejects invalid order and uses count_desc', () => {
    expect(parseListStateFromSearchParams(params({ order: 'invalid' })).orderBy).toBe('count_desc')
    expect(parseListStateFromSearchParams(params({ order: 'name_desc' })).orderBy).toBe('name_desc')
  })

  it('rejects invalid taxon and uses empty string', () => {
    expect(parseListStateFromSearchParams(params({ taxon: 'invalid' })).filterSpeciesClass).toBe('')
    expect(parseListStateFromSearchParams(params({ taxon: 'all' })).filterSpeciesClass).toBe('')
  })

  it('parses taxon_id and clamps to at least 1', () => {
    expect(parseListStateFromSearchParams(params({ taxon_id: '12345' })).filterTaxonId).toBe(12345)
    expect(parseListStateFromSearchParams(params({ taxon_id: '0' })).filterTaxonId).toBe(1)
    expect(parseListStateFromSearchParams(params({})).filterTaxonId).toBe(null)
  })
})

describe('buildListStateSearchParams', () => {
  it('builds query string with all params', () => {
    const state: ListStateParams = {
      placeId: 100,
      page: 2,
      search: 'bird',
      orderBy: 'name_asc',
      filterEndemic: true,
      filterThreatened: true,
      filterSpeciesClass: 'aves',
      filterTaxonId: 47126,
    }
    const qs = buildListStateSearchParams(state)
    expect(qs).toContain('place_id=100')
    expect(qs).toContain('page=2')
    expect(qs).toContain('q=bird')
    expect(qs).toContain('order=name_asc')
    expect(qs).toContain('endemic=true')
    expect(qs).toContain('threatened=true')
    expect(qs).toContain('taxon=aves')
    expect(qs).toContain('taxon_id=47126')
  })

  it('round-trips with parseListStateFromSearchParams', () => {
    const state: ListStateParams = {
      placeId: 7354,
      page: 1,
      search: 'test',
      orderBy: 'count_asc',
      filterEndemic: false,
      filterThreatened: false,
      filterSpeciesClass: 'plantae',
      filterTaxonId: null,
    }
    const qs = buildListStateSearchParams(state)
    const parsed = parseListStateFromSearchParams(
      params(Object.fromEntries(new URLSearchParams(qs.slice(1)).entries()))
    )
    expect(parsed.placeId).toBe(state.placeId)
    expect(parsed.page).toBe(state.page)
    expect(parsed.search).toBe(state.search)
    expect(parsed.orderBy).toBe(state.orderBy)
    expect(parsed.filterEndemic).toBe(state.filterEndemic)
    expect(parsed.filterThreatened).toBe(state.filterThreatened)
    expect(parsed.filterSpeciesClass).toBe(state.filterSpeciesClass)
    expect(parsed.filterTaxonId).toBe(state.filterTaxonId)
  })
})
