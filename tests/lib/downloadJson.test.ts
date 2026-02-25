import { describe, it, expect, vi, beforeEach } from 'vitest'
import downloadJson from '@/lib/downloadJson'
import type { SpeciesCountResult } from '@/types'

describe('downloadJson', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let clickSpy: ReturnType<typeof vi.fn>
  let blobContent: string

  beforeEach(() => {
    clickSpy = vi.fn()
    blobContent = ''
    const fakeAnchor = {
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') return fakeAnchor
      return document.createElement(tagName)
    })
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => fakeAnchor)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => fakeAnchor)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(globalThis, 'Blob').mockImplementation(function (this: Blob, parts: BlobPart[]) {
      blobContent = (parts as string[]).join('')
      return { size: 0, type: '' } as Blob
    })
  })

  it('stringifies species as JSON and triggers anchor click', () => {
    const species: SpeciesCountResult[] = [
      {
        taxon: {
          id: 1,
          name: 'Quercus alba',
          preferred_common_name: 'white oak',
          iconic_taxon_name: 'Plantae',
        },
        count: 42,
      },
    ]

    downloadJson(species)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalled()
    const parsed = JSON.parse(blobContent) as SpeciesCountResult[]
    expect(parsed).toHaveLength(1)
    expect(parsed[0].taxon.name).toBe('Quercus alba')
    expect(parsed[0].count).toBe(42)
  })
})
