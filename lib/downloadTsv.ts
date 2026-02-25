import type { SpeciesCountResult } from '@/types'
import downloadBlob from '@/lib/downloadBlob'
import { getExportRows } from '@/lib/exportSpeciesData'

const downloadTsv = (species: SpeciesCountResult[]): void => {
  const rows = getExportRows(species)
  const tsvContent = rows.map((row) => row.join('\t')).join('\n')
  const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8' })
  downloadBlob(blob, `species-export-${Date.now()}.tsv`, 'text/tab-separated-values;charset=utf-8')
}

export default downloadTsv
