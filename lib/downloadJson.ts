import type { SpeciesCountResult } from '@/types'

const downloadJson = (species: SpeciesCountResult[]): void => {
  const json = JSON.stringify(species, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `species-export-${Date.now()}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export default downloadJson
