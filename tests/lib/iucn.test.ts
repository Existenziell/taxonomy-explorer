import { describe, it, expect } from 'vitest'
import { iucnCodeToLabel, getIucnFromStatuses, getPrimaryStatusNameFromStatuses } from '@/lib/iucn'

describe('iucnCodeToLabel', () => {
  it('returns label for iNaturalist API codes', () => {
    expect(iucnCodeToLabel(0)).toBe('Not Evaluated')
    expect(iucnCodeToLabel(10)).toBe('Least Concern')
    expect(iucnCodeToLabel(20)).toBe('Near Threatened')
    expect(iucnCodeToLabel(30)).toBe('Vulnerable')
    expect(iucnCodeToLabel(40)).toBe('Endangered')
    expect(iucnCodeToLabel(70)).toBe('Extinct')
  })

  it('returns undefined for unknown code', () => {
    expect(iucnCodeToLabel(99)).toBeUndefined()
  })
})

describe('getIucnFromStatuses', () => {
  it('returns most threatened IUCN (highest code) from statuses', () => {
    const statuses = [{ iucn: 10 }, { iucn: 30 }]
    expect(getIucnFromStatuses(statuses)).toEqual({ code: 30, label: 'Vulnerable' })
  })

  it('returns null for null or undefined', () => {
    expect(getIucnFromStatuses(null)).toBeNull()
    expect(getIucnFromStatuses(undefined)).toBeNull()
  })

  it('returns null for empty array', () => {
    expect(getIucnFromStatuses([])).toBeNull()
  })

  it('skips statuses without valid label and returns best', () => {
    const statuses = [{ iucn: 30 }, { iucn: 10 }]
    expect(getIucnFromStatuses(statuses)).toEqual({ code: 30, label: 'Vulnerable' })
  })
})

describe('getPrimaryStatusNameFromStatuses', () => {
  it('returns status_name from most threatened status', () => {
    const statuses = [
      { iucn: 10, status_name: 'Least Concern' },
      { iucn: 30, status_name: 'Vulnerable' },
    ]
    expect(getPrimaryStatusNameFromStatuses(statuses)).toBe('Vulnerable')
  })

  it('returns null for empty or null', () => {
    expect(getPrimaryStatusNameFromStatuses(null)).toBeNull()
    expect(getPrimaryStatusNameFromStatuses([])).toBeNull()
  })
})
