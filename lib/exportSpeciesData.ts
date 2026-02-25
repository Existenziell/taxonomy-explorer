import type { SpeciesCountResult } from '@/types'
import translateStatusName from '@/lib/translateStatusName'
import capitalize from '@/lib/capitalize'

export const EXPORT_HEADERS = [
  'Name',
  'Latin Name',
  'Taxonomy',
  'Observations',
  'Status',
  'Wikipedia Link',
  'Photo',
] as const

/**
 * Returns one row of export data (same columns for CSV/TSV).
 */
export function getExportRow (s: SpeciesCountResult): string[] {
  return [
    capitalize(s.taxon.preferred_common_name) ?? '',
    s.taxon.name,
    s.taxon.iconic_taxon_name,
    String(s.count),
    s.taxon.conservation_status?.status_name
      ? translateStatusName(s.taxon.conservation_status.status_name)
      : 'No data',
    s.taxon.wikipedia_url ?? '',
    s.taxon.default_photo?.medium_url ?? '',
  ]
}

export function getExportRows (species: SpeciesCountResult[]): string[][] {
  return [EXPORT_HEADERS as unknown as string[], ...species.map(getExportRow)]
}
