async function fetchApi<T = unknown>(...args: Parameters<typeof fetch>): Promise<T> {
  const res = await fetch(...args)
  return await res.json() as T
}

export default fetchApi
