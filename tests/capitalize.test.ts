import { describe, it, expect } from 'vitest'
import capitalize from '@/lib/capitalize'

describe('capitalize', () => {
  it('returns undefined for undefined', () => {
    expect(capitalize(undefined)).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(capitalize(null)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(capitalize('')).toBeUndefined()
  })

  it('capitalizes a single word', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('capitalizes each word in a string', () => {
    expect(capitalize('hello world')).toBe('Hello World')
  })

  it('handles multiple words', () => {
    expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox')
  })
})
