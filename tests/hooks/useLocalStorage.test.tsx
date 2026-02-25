import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function TestComponent({
  storageKey,
  initialValue,
}: {
  storageKey: string
  initialValue: string
}) {
  const [value, setValue] = useLocalStorage(storageKey, initialValue)
  return (
    <div>
      <span data-testid="value">{value}</span>
      <button type="button" onClick={() => setValue('updated')}>
        set
      </button>
      <button type="button" onClick={() => setValue((prev) => prev + '-fn')}>
        set fn
      </button>
    </div>
  )
}

describe('useLocalStorage', () => {
  const storage: Record<string, string> = {}
  let setItemSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k])
    setItemSpy = vi.fn((key: string, value: string) => {
      storage[key] = value
    })
    vi.stubGlobal(
      'localStorage',
      {
        getItem: (key: string) => storage[key] ?? null,
        setItem: setItemSpy,
        removeItem: (key: string) => {
          delete storage[key]
        },
        length: 0,
        key: () => null,
        clear: () => {
          Object.keys(storage).forEach((k) => delete storage[k])
        },
      }
    )
  })

  it('returns initialValue when key is not in localStorage', () => {
    const { getByTestId } = render(<TestComponent storageKey="test-key" initialValue="initial" />)
    expect(getByTestId('value').textContent).toBe('initial')
  })

  it('returns stored value when key exists in localStorage', () => {
    storage['existing'] = JSON.stringify('stored')
    const { getByTestId } = render(<TestComponent storageKey="existing" initialValue="initial" />)
    expect(getByTestId('value').textContent).toBe('stored')
  })

  it('updates state and localStorage when setValue is called', () => {
    const { getByTestId, getByText } = render(<TestComponent storageKey="update-key" initialValue="initial" />)
    act(() => {
      getByText('set').click()
    })
    expect(getByTestId('value').textContent).toBe('updated')
    expect(setItemSpy).toHaveBeenCalledWith('update-key', JSON.stringify('updated'))
  })

  it('supports updater function', () => {
    const { getByTestId, getByText } = render(<TestComponent storageKey="fn-key" initialValue="a" />)
    act(() => {
      getByText('set fn').click()
    })
    expect(getByTestId('value').textContent).toBe('a-fn')
    expect(setItemSpy).toHaveBeenCalledWith('fn-key', JSON.stringify('a-fn'))
  })
})
