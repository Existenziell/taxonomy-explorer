import type { SpeciesCountResult } from '@/types'
import translateStatusName from '@/lib/translateStatusName'
import capitalize from '@/lib/capitalize'

const downloadCsv = (species: SpeciesCountResult[]): void => {
  const rows: string[][] = [
    ['Name', 'Latin Name', 'Taxonomy', 'Observations', 'Status', 'Wikipedia Link', 'Photo'],
  ]
  species.map((s) => {
    const element = [
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
    rows.push(element)
    return element
  })

  const csvContent =
    'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)

  const anchor = document.createElement('a')
  anchor.href = encodedUri
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export default downloadCsv
