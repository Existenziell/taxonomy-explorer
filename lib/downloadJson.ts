import type { SpeciesCountResult } from '@/types'
import downloadBlob from '@/lib/downloadBlob'

const downloadJson = (species: SpeciesCountResult[]): void => {
  const json = JSON.stringify(species, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, `species-export-${Date.now()}.json`, 'application/json')
}

export default downloadJson
