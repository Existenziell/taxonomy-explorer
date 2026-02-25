import { describe, it, expect, vi, beforeEach } from 'vitest'
import downloadTsv from '@/lib/downloadTsv'
import type { SpeciesCountResult } from '@/types'

describe('downloadTsv', () => {
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

  it('builds TSV with header and one data row and triggers anchor click', () => {
    const species: SpeciesCountResult[] = [
      {
        taxon: {
          id: 1,
          name: 'Quercus alba',
          preferred_common_name: 'white oak',
          iconic_taxon_name: 'Plantae',
          conservation_status: { status_name: 'amenazada' },
          wikipedia_url: 'https://en.wikipedia.org/wiki/Quercus_alba',
          default_photo: { medium_url: 'https://example.com/photo.jpg' },
        },
        count: 42,
      },
    ]

    downloadTsv(species)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalled()
    expect(blobContent).toContain('Name\tLatin Name\tTaxonomy\tObservations\tStatus\tWikipedia Link\tPhoto')
    expect(blobContent).toContain('White Oak')
    expect(blobContent).toContain('Quercus alba')
    expect(blobContent).toContain('Threatened')
  })
})
