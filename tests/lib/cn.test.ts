import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('merges single class', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cn('foo', null, undefined, false, 'bar')).toBe('foo bar')
  })

  it('tailwind-merge: later class overrides conflicting', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('handles conditional object', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })

  it('handles array of classes', () => {
    expect(cn(['a', 'b'])).toBe('a b')
  })
})
