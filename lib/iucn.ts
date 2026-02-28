import type { TaxonConservationStatusLike, TaxonConservationStatus } from '@/types'

/**
 * IUCN Red List category codes as used by the iNaturalist API:
 * 0=NE, 5=DD, 10=LC, 20=NT, 30=VU, 40=EN, 50=CR, 60=EW, 70=EX.
 */
const IUCN_CODE_TO_LABEL: Record<number, string> = {
  0: 'Not Evaluated',
  5: 'Data Deficient',
  10: 'Least Concern',
  20: 'Near Threatened',
  30: 'Vulnerable',
  40: 'Endangered',
  50: 'Critically Endangered',
  60: 'Extinct in the Wild',
  70: 'Extinct',
}

export function iucnCodeToLabel (code: number): string | undefined {
  return IUCN_CODE_TO_LABEL[code]
}

export type { TaxonConservationStatusLike } from '@/types'

/**
 * Returns the most threatened IUCN status from the list (highest iucn code),
 * so we show e.g. Vulnerable instead of Not Evaluated when both exist.
 */
export function getIucnFromStatuses (
  conservationStatuses: TaxonConservationStatusLike[] | null | undefined
): { code: number; label: string } | null {
  if (conservationStatuses == null || conservationStatuses.length === 0) return null
  let best: { code: number; label: string } | null = null
  for (const cs of conservationStatuses) {
    if (cs.iucn != null && typeof cs.iucn === 'number') {
      const label = iucnCodeToLabel(cs.iucn)
      if (label != null && (best == null || cs.iucn > best.code)) {
        best = { code: cs.iucn, label }
      }
    }
  }
  return best
}

/**
 * Returns the status_name from the most threatened conservation status (highest iucn),
 * or the first status_name found. Used for detail page when conservation_status is empty.
 */
export function getPrimaryStatusNameFromStatuses (
  conservationStatuses: TaxonConservationStatus[] | null | undefined
): string | null {
  if (conservationStatuses == null || conservationStatuses.length === 0) return null
  const withIucn = conservationStatuses
    .filter((cs) => cs.iucn != null && typeof cs.iucn === 'number')
    .sort((a, b) => (b.iucn ?? 0) - (a.iucn ?? 0))
  const best = withIucn[0] ?? conservationStatuses[0]
  const name = best.status_name ?? best.status
  return name != null && String(name).trim() !== '' ? String(name).trim() : null
}
