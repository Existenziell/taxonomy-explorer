export const DEFAULT_PER_PAGE = 20

/** Minimum number of characters before search query is sent to the API */
export const MIN_SEARCH_LENGTH = 2

/** Base URL for species counts; append place_id and other params (e.g. &place_id=37612&locale=en) */
export const SPECIES_COUNTS_BASE_URL =
  'https://api.inaturalist.org/v1/observations/species_counts'

/** Base URL for iNaturalist places autocomplete */
export const PLACES_AUTOCOMPLETE_BASE_URL = 'https://api.inaturalist.org/v1/places/autocomplete'

/** Base URL for IP-based geo lookup */
export const IP_API_BASE = 'http://ip-api.com/json'

/** Base URL for iNaturalist places autocomplete */
export const INATURALIST_PLACES = 'https://api.inaturalist.org/v1/places/autocomplete'

/** URL for iNaturalist places by ID */
export const PLACE_ID_PARAM = 'place_id'
export const INATURALIST_PLACES_BY_ID = 'https://api.inaturalist.org/v1/places'

/** URL for GitHub repository */
export const GITHUB_URL = 'https://github.com/Existenziell/taxonomy-explorer'

/** URL for Christof's website */
export const CHRISTOF_URL = 'https://www.christof.digital/'

/** URL params for list state (home page filter/order/pagination) */
export const PAGE_PARAM = 'page'
export const SEARCH_PARAM = 'q'
export const ORDER_PARAM = 'order'
export const ENDEMIC_PARAM = 'endemic'
export const TAXON_PARAM = 'taxon'

/** Place ID for world-wide observations (iNaturalist Earth) */
export const WORLD_PLACE_ID = 1

/** Display name for world place */
export const WORLD_PLACE_DISPLAY_NAME = 'World'

/** Default place (Svalbard) when none is selected or geo unavailable */
export const DEFAULT_PLACE_ID = 7354

/** Display name for default place (used when geo suggestion is unavailable) */
export const DEFAULT_PLACE_DISPLAY_NAME = 'Svalbard'

/** Fallback regions when IP-based suggestion is unavailable (e.g. localhost, geo error) — biodiverse or overlooked */
export const FALLBACK_REGIONS: { id: number; name: string }[] = [
  { id: 7783, name: 'Madagascar' },
  { id: 6924, name: 'Costa Rica' },
  { id: 6829, name: 'Tasmania' },
  { id: 13197, name: 'Azores' },
  { id: 6803, name: 'New Zealand' },
]

export const SCROLL_TO_TOP_THRESHOLD = 800
