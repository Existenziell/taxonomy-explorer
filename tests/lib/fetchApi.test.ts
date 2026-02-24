import { describe, it, expect, vi, beforeEach } from 'vitest'
import fetchApi from '@/lib/fetchApi'

describe('fetchApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('calls fetch and returns parsed JSON', async () => {
    const data = { foo: 'bar' }
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(data),
    })
    globalThis.fetch = fetchMock

    const result = await fetchApi<typeof data>('https://example.com')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com')
    expect(result).toEqual(data)
  })

  it('passes through fetch arguments', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve({}) })
    globalThis.fetch = fetchMock

    await fetchApi('https://api.test', { method: 'POST', body: '{}' })

    expect(fetchMock).toHaveBeenCalledWith('https://api.test', {
      method: 'POST',
      body: '{}',
    })
  })
})
