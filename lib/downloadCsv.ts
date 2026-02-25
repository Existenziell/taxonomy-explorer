import type { SpeciesCountResult } from '@/types'
import downloadBlob from '@/lib/downloadBlob'
import { getExportRows } from '@/lib/exportSpeciesData'

function escapeCsvField (value: string): string {
  if (!/[\n,"]/.test(value)) return value
  return `"${value.replace(/"/g, '""')}"`
}

const downloadCsv = (species: SpeciesCountResult[]): void => {
  const rows = getExportRows(species)
  const csvContent = rows
    .map((row) => row.map(escapeCsvField).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `species-export-${Date.now()}.csv`, 'text/csv;charset=utf-8')
}

export default downloadCsv
