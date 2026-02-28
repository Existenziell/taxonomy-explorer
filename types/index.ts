import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

// --- iNaturalist API ---

export interface CorePlace {
  id?: number
  name?: string
  display_name?: string
}

export interface ConservationStatus {
  status_name?: string
  status?: string
  place_id?: number
  place?: CorePlace
}

export interface TaxonConservationStatus {
  source_id?: number
  authority?: string
  status?: string
  status_name?: string
  iucn?: number
  geoprivacy?: string
  place?: CorePlace
}

export interface Color {
  id: number
  value: string
}

export interface EstablishmentMeans {
  establishment_means?: string
  place?: CorePlace
}

export interface OriginalDimensions {
  width?: number
  height?: number
}

export interface DefaultPhoto {
  medium_url: string
  large_url?: string
  original_dimensions?: OriginalDimensions
}

export interface TaxonPhotoPhoto {
  large_url: string
  original_dimensions?: OriginalDimensions
}

export interface TaxonPhoto {
  photo: TaxonPhotoPhoto
}

export interface Taxon {
  id: number
  name: string
  preferred_common_name: string | null
  iconic_taxon_name: string
  conservation_status?: ConservationStatus | null
  conservation_statuses?: TaxonConservationStatus[] | null
  extinct?: boolean
  default_photo?: DefaultPhoto | null
  wikipedia_url?: string | null
  wikipedia_summary?: string | null
  observations_count?: number
  taxon_photos?: TaxonPhoto[] | null
  rank?: string
  rank_level?: number
  is_active?: boolean
  ancestor_ids?: number[]
  parent_id?: number
  ancestors?: Taxon[]
  colors?: Color[]
  establishment_means?: EstablishmentMeans | null
  preferred_establishment_means?: string | null
}

export interface SpeciesCountResult {
  taxon: Taxon
  count: number
}

export interface SpeciesCountsResponse {
  results: SpeciesCountResult[]
  per_page: number
  total_results: number
}

export interface TaxaResponse {
  results: Taxon[]
}

// --- React props ---

export interface ProvidersProps {
  children: ReactNode
}

export type SetPage = Dispatch<SetStateAction<number>>
export type SetFilterEndemic = Dispatch<SetStateAction<boolean>>
export type SetFilterThreatened = Dispatch<SetStateAction<boolean>>
export type SetFilterSpeciesClass = Dispatch<SetStateAction<string>>
export type SetFilterTaxonId = Dispatch<SetStateAction<number | null>>
export type SetSearch = Dispatch<SetStateAction<string>>

/** Order for species list: count (API default), or client-side sort by name */
export type OrderByOption = 'count_desc' | 'count_asc' | 'name_asc' | 'name_desc'

export interface SpeciesCountsError {
  error: string
}

export interface PaginationProps {
  page: number
  setPage: SetPage
  numberOfPages: number
  totalResults?: number
  showNoResultsMessage?: boolean
}

/** Place result from iNaturalist places autocomplete */
export interface PlaceAutocompleteResult {
  id: number
  name?: string
  display_name?: string
}

export interface FiltersProps {
  placeId: number
  placeDisplayName: string
  onPlaceSelect: (placeId: number, placeDisplayName: string) => void
  orderBy: OrderByOption
  setOrderBy: Dispatch<SetStateAction<OrderByOption>>
  filterEndemic: boolean
  setFilterEndemic: SetFilterEndemic
  filterThreatened: boolean
  setFilterThreatened: SetFilterThreatened
  filterSpeciesClass: string
  setFilterSpeciesClass: SetFilterSpeciesClass
  filterTaxonId: number | null
  setFilterTaxonId: SetFilterTaxonId
  onResetFilters: () => void
}

/** Taxon option for filter dropdowns (id + display name, optional rank) */
export interface TaxonOption {
  id: number
  name: string
  rank?: string
}

export interface SearchProps {
  search: string
  setSearch: SetSearch
}

export interface RootLayoutProps {
  children: ReactNode
}

export interface ArrowProps {
  direction: 'up' | 'down' | 'left' | 'right'
  ariaLabel: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  iconClassName?: string
}

// --- API / geo ---

/** iNaturalist places by ID response */
export interface PlaceByIdResult {
  results?: Array<{ id: number; name?: string; display_name?: string }>
}

/** Response from GET /api/geo (suggested place from IP) */
export interface GeoResponse {
  suggestedPlaceId: number | null
  suggestedPlaceName: string | null
  countryName: string | null
}

/** iNaturalist places autocomplete response */
export interface PlacesAutocompleteResponse {
  results: PlaceAutocompleteResult[]
}

/** Response from ip-api.com (only fields we request) */
export interface IpApiResponse {
  status?: string
  country?: string
  countryCode?: string
  regionName?: string
}

/** iNaturalist places autocomplete response (API route) */
export interface PlacesResponse {
  results?: PlaceAutocompleteResult[]
}

// --- IUCN / conservation ---

/** Minimal conservation status shape for IUCN code lookup */
export interface TaxonConservationStatusLike {
  iucn?: number
}

// --- Theme ---

export type ThemeMode = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: ThemeMode | undefined
  resolvedTheme: ResolvedTheme
  mounted: boolean
  setTheme: (mode: ThemeMode) => void
}

// --- Component props ---

export interface AppLinkProps {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
}
