import type { SpeciesCountResult } from '@/types'
import type { OrderByOption } from '@/types'

export function sortSpeciesResults (
  results: SpeciesCountResult[],
  orderBy: OrderByOption
): SpeciesCountResult[] {
  if (orderBy === 'count_desc') return results
  const sorted = [...results]
  if (orderBy === 'count_asc') {
    sorted.sort((a, b) => a.count - b.count)
  } else {
    sorted.sort((a, b) => {
      const nameA = (a.taxon.preferred_common_name ?? a.taxon.name ?? '').toLowerCase()
      const nameB = (b.taxon.preferred_common_name ?? b.taxon.name ?? '').toLowerCase()
      const cmp = nameA.localeCompare(nameB)
      return orderBy === 'name_asc' ? cmp : -cmp
    })
  }
  return sorted
}
