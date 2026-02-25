import type { SpeciesCountResult } from '@/types'
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
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `species-export-${Date.now()}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export default downloadCsv
