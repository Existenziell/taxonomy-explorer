import { describe, it, expect } from 'vitest'
import translateStatusName from '@/lib/translateStatusName'

describe('translateStatusName', () => {
  it('translates "amenazada" to "Threatened"', () => {
    expect(translateStatusName('amenazada')).toBe('Threatened')
  })

  it('translates "sujeta a protección especial" to "Subject to special protection"', () => {
    expect(translateStatusName('sujeta a protección especial')).toBe(
      'Subject to special protection'
    )
  })

  it('translates "en peligro de extinción" to "In danger of extinction"', () => {
    expect(translateStatusName('en peligro de extinción')).toBe(
      'In danger of extinction'
    )
  })

  it('returns unknown status unchanged', () => {
    expect(translateStatusName('Unknown status')).toBe('Unknown status')
  })

  it('is case insensitive', () => {
    expect(translateStatusName('AMENAZADA')).toBe('Threatened')
    expect(translateStatusName('Amenazada')).toBe('Threatened')
  })
})
