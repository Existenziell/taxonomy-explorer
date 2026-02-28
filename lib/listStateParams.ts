import type { OrderByOption } from '@/types'
import {
  DEFAULT_PLACE_ID,
  PLACE_ID_PARAM,
  PAGE_PARAM,
  SEARCH_PARAM,
  ORDER_PARAM,
  ENDEMIC_PARAM,
  THREATENED_PARAM,
  TAXON_PARAM,
  TAXON_ID_PARAM,
  VALID_ORDER,
  VALID_TAXON,
} from '@/lib/constants'

export interface ListStateParams {
  placeId: number
  page: number
  search: string
  orderBy: OrderByOption
  filterEndemic: boolean
  filterThreatened: boolean
  filterSpeciesClass: string
  filterTaxonId: number | null
}

interface SearchParamsLike {
  get(name: string): string | null
}

export function parseListStateFromSearchParams(
  searchParams: SearchParamsLike
): ListStateParams {
  const placeIdRaw = searchParams.get(PLACE_ID_PARAM)
  const placeId = placeIdRaw != null && /^\d+$/.test(placeIdRaw)
    ? Math.max(1, parseInt(placeIdRaw, 10))
    : DEFAULT_PLACE_ID

  const pageRaw = searchParams.get(PAGE_PARAM)
  const page = pageRaw != null && /^\d+$/.test(pageRaw)
    ? Math.max(1, parseInt(pageRaw, 10))
    : 1

  const search = searchParams.get(SEARCH_PARAM) ?? ''

  const orderRaw = searchParams.get(ORDER_PARAM)
  const orderBy: OrderByOption = orderRaw != null && VALID_ORDER.includes(orderRaw as OrderByOption)
    ? (orderRaw as OrderByOption)
    : 'count_desc'

  const endemicRaw = searchParams.get(ENDEMIC_PARAM)
  const filterEndemic = endemicRaw === 'true'

  const threatenedRaw = searchParams.get(THREATENED_PARAM)
  const filterThreatened = threatenedRaw === 'true'

  const taxonRaw = searchParams.get(TAXON_PARAM)
  const filterSpeciesClass =
    taxonRaw != null && taxonRaw !== '' && VALID_TAXON.has(taxonRaw)
      ? (taxonRaw === 'all' ? '' : taxonRaw)
      : ''

  const taxonIdRaw = searchParams.get(TAXON_ID_PARAM)
  const filterTaxonId =
    taxonIdRaw != null && /^\d+$/.test(taxonIdRaw)
      ? Math.max(1, parseInt(taxonIdRaw, 10))
      : null

  return {
    placeId,
    page,
    search,
    orderBy,
    filterEndemic,
    filterThreatened,
    filterSpeciesClass,
    filterTaxonId,
  }
}

export function buildListStateSearchParams(state: ListStateParams): string {
  const params = new URLSearchParams()
  params.set(PLACE_ID_PARAM, String(state.placeId))
  params.set(PAGE_PARAM, String(state.page))
  if (state.search) params.set(SEARCH_PARAM, state.search)
  params.set(ORDER_PARAM, state.orderBy)
  params.set(ENDEMIC_PARAM, String(state.filterEndemic))
  params.set(THREATENED_PARAM, String(state.filterThreatened))
  if (state.filterSpeciesClass) params.set(TAXON_PARAM, state.filterSpeciesClass)
  if (state.filterTaxonId != null) params.set(TAXON_ID_PARAM, String(state.filterTaxonId))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
