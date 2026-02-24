import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

// --- iNaturalist API ---

export interface ConservationStatus {
  status_name: string
}

export interface OriginalDimensions {
  width?: number
  height?: number
}

export interface DefaultPhoto {
  medium_url: string
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
  extinct?: boolean
  default_photo?: DefaultPhoto | null
  wikipedia_url?: string | null
  wikipedia_summary?: string | null
  observations_count?: number
  taxon_photos?: TaxonPhoto[] | null
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
export type SetFilterSpeciesClass = Dispatch<SetStateAction<string>>
export type SetSearch = Dispatch<SetStateAction<string>>

export interface SpeciesCountsError {
  error: string
}

export interface PaginationProps {
  data: SpeciesCountResult[] | SpeciesCountsError | undefined
  page: number
  setPage: SetPage
  numberOfPages: number
  totalResults?: number
}

export interface FiltersProps {
  filterEndemic: boolean
  setFilterEndemic: SetFilterEndemic
  filterSpeciesClass: string
  setFilterSpeciesClass: SetFilterSpeciesClass
}

export interface SearchProps {
  search: string
  setSearch: SetSearch
}

export interface BackBtnProps {
  href: string
}

export interface RootLayoutProps {
  children: ReactNode
}
