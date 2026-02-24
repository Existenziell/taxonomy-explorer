'use client'

import Image from '@/components/Image'
import AppLink from '@/components/AppLink'
import translateStatusName from '@/lib/translateStatusName'
import downloadCsv from '@/lib/downloadCsv'
import Pagination from '@/components/Pagination'
import { useState, useCallback, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import useScrollToTop from '@/hooks/useScrollToTop'
import { useQuery } from '@tanstack/react-query'
import fetchApi from '@/lib/fetchApi'
import { SyncLoader } from 'react-spinners'
import { DownloadIcon } from '@/components/Icons'
import Arrow from '@/components/Arrow'
import Filters from '@/components/Filters'
import Search from '@/components/Search'
import type { SpeciesCountsResponse, SpeciesCountResult, OrderByOption, PlaceByIdResult } from '@/types'
import {
  DEFAULT_PER_PAGE,
  MIN_SEARCH_LENGTH,
  SPECIES_COUNTS_BASE_URL,
  SCROLL_TO_TOP_THRESHOLD,
  DEFAULT_PLACE_ID,
  DEFAULT_PLACE_DISPLAY_NAME,
  FALLBACK_REGIONS,
  PLACE_ID_PARAM,
  INATURALIST_PLACES_BY_ID,
} from '@/lib/constants'

function getPlaceDisplayName (placeId: number): string {
  if (placeId === DEFAULT_PLACE_ID) return DEFAULT_PLACE_DISPLAY_NAME
  return FALLBACK_REGIONS.find((r) => r.id === placeId)?.name ?? `Place ${placeId}`
}

function HomePageContent () {
  const searchParams = useSearchParams()
  const placeIdFromUrl = searchParams.get(PLACE_ID_PARAM)
  const initialPlaceId = placeIdFromUrl != null ? parseInt(placeIdFromUrl, 10) : DEFAULT_PLACE_ID
  const validPlaceId = Number.isInteger(initialPlaceId) && initialPlaceId > 0 ? initialPlaceId : DEFAULT_PLACE_ID

  const [placeId, setPlaceIdState] = useState(validPlaceId)
  const [placeDisplayName, setPlaceDisplayName] = useState(() => getPlaceDisplayName(validPlaceId))
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterSpeciesClass, setFilterSpeciesClass] = useState('')
  const [filterEndemic, setFilterEndemic] = useState(false)
  const [orderBy, setOrderBy] = useState<OrderByOption>('count_desc')
  const { showButton: showScrollToTop, scrollToTop } = useScrollToTop(SCROLL_TO_TOP_THRESHOLD)

  const setPlace = useCallback((id: number, displayName: string) => {
    setPlaceIdState(id)
    setPlaceDisplayName(displayName)
    const url = new URL(window.location.href)
    url.searchParams.set(PLACE_ID_PARAM, String(id))
    window.history.replaceState(null, '', url.toString())
  }, [])

  useEffect(() => {
    if (placeDisplayName !== `Place ${placeId}`) return
    let cancelled = false
    fetch(`${INATURALIST_PLACES_BY_ID}/${placeId}`)
      .then((res) => res.json() as Promise<PlaceByIdResult>)
      .then((data) => {
        if (cancelled) return
        const first = data?.results?.[0]
        const name = first?.display_name ?? first?.name
        if (name) setPlaceDisplayName(name)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [placeId, placeDisplayName])

  const effectiveSearch = search.length >= MIN_SEARCH_LENGTH ? search : ''

  const speciesCountsUrl = useMemo(() => {
    const base = `${SPECIES_COUNTS_BASE_URL}?place_id=${placeId}&locale=en`
    const params = `page=${page}&per_page=${DEFAULT_PER_PAGE}&endemic=${filterEndemic}&iconic_taxa=${filterSpeciesClass}`
    return effectiveSearch.length > 0
      ? `${base}&${params}&q=${encodeURIComponent(effectiveSearch)}`
      : `${base}&${params}`
  }, [placeId, page, filterEndemic, filterSpeciesClass, effectiveSearch])

  const { status, data } = useQuery<SpeciesCountsResponse>({
    queryKey: ['species', placeId, page, effectiveSearch, filterEndemic, filterSpeciesClass],
    queryFn: () => fetchApi<SpeciesCountsResponse>(speciesCountsUrl),
  })

  const numberOfPages =
    data?.per_page != null ? Math.ceil(data.total_results / data.per_page) : 0

  const sortedResults = useMemo((): SpeciesCountResult[] | undefined => {
    const results = data?.results
    if (results == null) return undefined
    if (orderBy === 'count_desc') return results
    const sorted = [...results]
    if (orderBy === 'count_asc') {
      sorted.sort((a, b) => a.count - b.count)
    } else {
      sorted.sort((a, b) => {
        const nameA = (a.taxon.preferred_common_name ?? a.taxon.name ?? '').toLowerCase()
        const nameB = (b.taxon.preferred_common_name ?? b.taxon.name ?? '').toLowerCase()
        const cmp = nameA.localeCompare(nameB)
        return orderBy === 'name_asc' ? cmp : -cmp
      })
    }
    return sorted
  }, [data?.results, orderBy])

  if (status === 'error') return <p>{status}</p>

  return (
    <>
      <h1 className="title title-hero">Taxonomy Explorer</h1>
      <div className="flex flex-col items-center w-full pb-16">
        <div className="toolbar mb-4">
          <Search search={search} setSearch={setSearch} />
          <button
            type="button"
            onClick={() => {
              if (sortedResults != null) downloadCsv(sortedResults)
            }}
            className="action-button"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </div>

        <Filters
          placeId={placeId}
          placeDisplayName={placeDisplayName}
          onPlaceSelect={setPlace}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          filterEndemic={filterEndemic}
          setFilterEndemic={setFilterEndemic}
          filterSpeciesClass={filterSpeciesClass}
          setFilterSpeciesClass={setFilterSpeciesClass}
        />

        {status === 'pending'
          ? (
              <div className="mt-8">
                <SyncLoader size={10} color="var(--color-cta)" />
              </div>
            )
          : (
            <>
              <p className="text-xl text-secondary mt-2 mb-2">
                {data != null && !('error' in data) && data.total_results != null
                  ? `${data.total_results.toLocaleString()} species`
                  : '0 species'}
              </p>
              <Pagination
                page={page}
                setPage={setPage}
                totalResults={data != null && 'error' in data ? 0 : data?.total_results}
                numberOfPages={numberOfPages}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                {sortedResults?.map((s) => {
                  const {
                    id,
                    name,
                    preferred_common_name,
                    iconic_taxon_name,
                    conservation_status,
                    extinct,
                    default_photo,
                  } = s.taxon
                  return (
                    <AppLink
                      href={`/species/${id}`}
                      key={`${id}-${name}-${preferred_common_name ?? ''}`}
                      className="card cursor-pointer hover:shadow-lg w-full flex flex-col justify-between"
                    >
                      {default_photo?.medium_url != null
                        ? (
                            <Image
                              src={default_photo.medium_url}
                              alt={preferred_common_name ?? name}
                              fill
                              blurDataURL={default_photo.medium_url}
                              wrapperClassName="mb-4 w-full aspect-[4/3] rounded bg-level-4 overflow-hidden relative"
                              className="object-cover"
                            />
                          )
                        : (
                            <div className="placeholder-image">No image</div>
                          )}
                      <div className="text-sm">
                        <h2 className="card-title">
                          {preferred_common_name ?? 'No common name available'}
                        </h2>
                        <p>Scientific Name: {name}</p>
                        <p>Taxonomy: {iconic_taxon_name}</p>
                        <p>Number of observations: {s.count}</p>
                        <p>
                          Status:{' '}
                          {conservation_status?.status_name != null
                            ? translateStatusName(conservation_status.status_name)
                            : 'No data'}
                        </p>
                        {extinct === true ? <p>Species has become extinct...</p> : null}
                      </div>
                    </AppLink>
                  )
                })}
              </div>
              <Pagination
                page={page}
                setPage={setPage}
                totalResults={data != null && 'error' in data ? 0 : data?.total_results}
                numberOfPages={numberOfPages}
                showNoResultsMessage={false}
              />
            </>
            )}

        {showScrollToTop && (
          <div className="flex justify-center mt-16">
            <Arrow direction="up" onClick={scrollToTop} ariaLabel="Scroll to top" />
          </div>
        )}
      </div>
    </>
  )
}

export default function HomePage () {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center w-full pb-16 mt-8">
        <SyncLoader size={10} color="var(--color-cta)" />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
