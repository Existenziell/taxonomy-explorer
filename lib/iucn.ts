import type { TaxonConservationStatusLike } from '@/types'

/**
 * IUCN Red List category codes (numeric) to human-readable labels.
 * Aligns with standard categories: NE, DD, LC, NT, VU, EN, CR, EW, EX.
 * Exact numeric values may vary by API; adjust if real responses differ.
 */
const IUCN_CODE_TO_LABEL: Record<number, string> = {
  0: 'Not Evaluated',
  1: 'Data Deficient',
  2: 'Least Concern',
  3: 'Near Threatened',
  4: 'Vulnerable',
  5: 'Endangered',
  6: 'Critically Endangered',
  7: 'Extinct in the Wild',
  8: 'Extinct',
}

export function iucnCodeToLabel (code: number): string | undefined {
  return IUCN_CODE_TO_LABEL[code]
}

export type { TaxonConservationStatusLike } from '@/types'

/**
 * Returns the first IUCN code and its label from conservation statuses, or null.
 */
export function getIucnFromStatuses (
  conservationStatuses: TaxonConservationStatusLike[] | null | undefined
): { code: number; label: string } | null {
  if (conservationStatuses == null) return null
  for (const cs of conservationStatuses) {
    if (cs.iucn != null && typeof cs.iucn === 'number') {
      const label = iucnCodeToLabel(cs.iucn)
      if (label != null) return { code: cs.iucn, label }
    }
  }
  return null
}
