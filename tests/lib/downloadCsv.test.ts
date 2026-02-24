import { describe, it, expect, vi, beforeEach } from 'vitest'
import downloadCsv from '@/lib/downloadCsv'
import type { SpeciesCountResult } from '@/types'

describe('downloadCsv', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let clickSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clickSpy = vi.fn()
    const fakeAnchor = { href: '', click: clickSpy } as unknown as HTMLAnchorElement
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') return fakeAnchor
      return document.createElement(tagName)
    })
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => fakeAnchor)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => fakeAnchor)
  })

  it('builds CSV with header and one data row and triggers anchor click', () => {
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

    const encodeURISpy = vi.spyOn(globalThis, 'encodeURI').mockImplementation((s) => s)

    downloadCsv(species)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalled()

    const csvContent = (encodeURISpy.mock.calls[0] as [string])[0]
    expect(csvContent).toContain('Name,Latin Name,Taxonomy,Observations,Status,Wikipedia Link,Photo')
    expect(csvContent).toContain('White Oak')
    expect(csvContent).toContain('Quercus alba')
    expect(csvContent).toContain('Plantae')
    expect(csvContent).toContain('42')
    expect(csvContent).toContain('Threatened')
    expect(csvContent).toContain('https://en.wikipedia.org/wiki/Quercus_alba')
    expect(csvContent).toContain('https://example.com/photo.jpg')

    encodeURISpy.mockRestore()
  })
})
