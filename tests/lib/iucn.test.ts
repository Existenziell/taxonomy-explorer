import { describe, it, expect } from 'vitest'
import { iucnCodeToLabel, getIucnFromStatuses } from '@/lib/iucn'

describe('iucnCodeToLabel', () => {
  it('returns label for known codes', () => {
    expect(iucnCodeToLabel(0)).toBe('Not Evaluated')
    expect(iucnCodeToLabel(2)).toBe('Least Concern')
    expect(iucnCodeToLabel(5)).toBe('Endangered')
    expect(iucnCodeToLabel(8)).toBe('Extinct')
  })

  it('returns undefined for unknown code', () => {
    expect(iucnCodeToLabel(99)).toBeUndefined()
  })
})

describe('getIucnFromStatuses', () => {
  it('returns first IUCN code and label from statuses', () => {
    const statuses = [{ iucn: 5 }, { iucn: 2 }]
    expect(getIucnFromStatuses(statuses)).toEqual({ code: 5, label: 'Endangered' })
  })

  it('returns null for null or undefined', () => {
    expect(getIucnFromStatuses(null)).toBeNull()
    expect(getIucnFromStatuses(undefined)).toBeNull()
  })

  it('returns null for empty array', () => {
    expect(getIucnFromStatuses([])).toBeNull()
  })

  it('skips statuses without iucn and returns first valid', () => {
    const statuses = [{}, { iucn: 3 }]
    expect(getIucnFromStatuses(statuses)).toEqual({ code: 3, label: 'Near Threatened' })
  })
})
