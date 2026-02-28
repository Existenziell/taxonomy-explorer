import type { Taxon } from '@/types'

/**
 * IUCN codes in iNaturalist API: 0=NE, 5=DD, 10=LC, 20=NT, 30=VU, 40=EN, 50=CR, 60=EW, 70=EX.
 * Threatened = Vulnerable (30) and above.
 */
const IUCN_THREATENED_MIN = 30

/** status_name values (lowercase) that mean the taxon is NOT threatened. */
const NOT_THREATENED_STATUS_NAMES = new Set([
  'secure',
  'least concern',
  'lc',
  'near threatened',
  'nt',
  'not evaluated',
  'ne',
  'data deficient',
  'dd',
])

/** status_name values (lowercase) that mean the taxon is threatened. */
const THREATENED_STATUS_NAMES = new Set([
  'vulnerable',
  'vu',
  'endangered',
  'en',
  'critically endangered',
  'cr',
  'extinct in the wild',
  'ew',
  'extinct',
  'ex',
  'threatened',
  'amenazada',
  'en peligro de extinción',
  'sujeta a protección especial',
])

/**
 * Returns true only if the taxon is threatened/endangered (so it should appear
 * when "Only display endangered species" is on). Excludes "secure", "least concern",
 * and "no data".
 */
export function isTaxonThreatened (taxon: Taxon): boolean {
  if (taxon.extinct === true) return true

  const statuses = taxon.conservation_statuses
  if (statuses != null && statuses.length > 0) {
    for (const cs of statuses) {
      if (cs.iucn != null && typeof cs.iucn === 'number' && cs.iucn >= IUCN_THREATENED_MIN) {
        return true
      }
    }
  }

  const statusName = taxon.conservation_status?.status_name?.trim()
  if (statusName == null || statusName === '') return false
  const lower = statusName.toLowerCase()
  if (NOT_THREATENED_STATUS_NAMES.has(lower)) return false
  if (THREATENED_STATUS_NAMES.has(lower)) return true

  return false
}
