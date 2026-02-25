import { NextRequest } from 'next/server'
import {
  SPECIES_COUNTS_BASE_URL,
  DEFAULT_PLACE_ID,
  MIN_SEARCH_LENGTH,
} from '@/lib/constants'
import type { SpeciesCountsResponse, SpeciesCountResult, OrderByOption } from '@/types'
import { sortSpeciesResults } from '@/lib/sortSpeciesResults'

const VALID_ORDER: OrderByOption[] = ['count_desc', 'count_asc', 'name_asc', 'name_desc']
const VALID_TAXON = new Set([
  'all', 'actinopterygii', 'animalia', 'amphibia', 'arachnida', 'aves', 'chromista',
  'fungi', 'insecta', 'mammalia', 'mollusca', 'reptilia', 'plantae', 'protozoa', 'unknown',
])

const EXPORT_PER_PAGE = 200
const MAX_PAGES = 100

/**
 * GET /api/export?place_id=7354&q=&endemic=false&taxon=&order=count_desc
 * Fetches all pages from iNaturalist species_counts, sorts by order, returns full list.
 */
export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const placeIdRaw = searchParams.get('place_id')
  const placeId =
    placeIdRaw != null && /^\d+$/.test(placeIdRaw)
      ? Math.max(1, parseInt(placeIdRaw, 10))
      : DEFAULT_PLACE_ID

  const search = searchParams.get('q') ?? ''
  const effectiveSearch = search.length >= MIN_SEARCH_LENGTH ? search : ''

  const orderRaw = searchParams.get('order')
  const orderBy: OrderByOption =
    orderRaw != null && VALID_ORDER.includes(orderRaw as OrderByOption)
      ? (orderRaw as OrderByOption)
      : 'count_desc'

  const endemic = searchParams.get('endemic') === 'true'

  const taxonRaw = searchParams.get('taxon')
  const iconicTaxa =
    taxonRaw != null && taxonRaw !== '' && VALID_TAXON.has(taxonRaw)
      ? (taxonRaw === 'all' ? '' : taxonRaw)
      : ''

  const baseUrl =
    `${SPECIES_COUNTS_BASE_URL}?place_id=${placeId}&locale=en` +
    `&per_page=${EXPORT_PER_PAGE}&endemic=${endemic}&iconic_taxa=${iconicTaxa}`

  const allResults: SpeciesCountResult[] = []
  let totalResults = 0
  let page = 1

  try {
    while (page <= MAX_PAGES) {
      const url = effectiveSearch.length > 0
        ? `${baseUrl}&page=${page}&q=${encodeURIComponent(effectiveSearch)}`
        : `${baseUrl}&page=${page}`

      const res = await fetch(url, { next: { revalidate: 0 } })
      const data = (await res.json()) as SpeciesCountsResponse

      if (!res.ok || 'error' in data) {
        return Response.json(
          { error: 'error' in data ? (data as { error: string }).error : 'Export failed' },
          { status: 502 }
        )
      }

      const results = data.results ?? []
      totalResults = data.total_results ?? 0
      allResults.push(...results)

      if (results.length < EXPORT_PER_PAGE || allResults.length >= totalResults) {
        break
      }
      page += 1
    }

    const sorted = sortSpeciesResults(allResults, orderBy)

    return Response.json({
      results: sorted,
      total_results: totalResults,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Export failed' },
      { status: 500 }
    )
  }
}
