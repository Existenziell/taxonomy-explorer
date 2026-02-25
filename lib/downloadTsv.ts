import type { SpeciesCountResult } from '@/types'
import { getExportRows } from '@/lib/exportSpeciesData'

const downloadTsv = (species: SpeciesCountResult[]): void => {
  const rows = getExportRows(species)
  const tsvContent = rows.map((row) => row.join('\t')).join('\n')
  const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `species-export-${Date.now()}.tsv`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export default downloadTsv
