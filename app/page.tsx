'use client'

import Image from '@/components/Image'
import AppLink from '@/components/AppLink'
import translateStatusName from '@/lib/translateStatusName'
import Pagination from '@/components/Pagination'
import DownloadModal from '@/components/DownloadModal'
import { useState, useCallback, useMemo, useEffect, useRef, Suspense, type SetStateAction } from 'react'
import { useSearchParams } from 'next/navigation'
import useScrollToTop from '@/hooks/useScrollToTop'
import { useQuery } from '@tanstack/react-query'
import fetchApi from '@/lib/fetchApi'
import { SyncLoader } from 'react-spinners'
import { DownloadIcon } from '@/components/Icons'
import Arrow from '@/components/Arrow'
import Filters from '@/components/Filters'
import Search from '@/components/Search'
import type { SpeciesCountsResponse, SpeciesCountResult, OrderByOption, PlaceByIdResult, GeoResponse } from '@/types'
import {
  DEFAULT_PER_PAGE,
  MIN_SEARCH_LENGTH,
  SPECIES_COUNTS_BASE_URL,
  SCROLL_TO_TOP_THRESHOLD,
  DEFAULT_PLACE_ID,
  DEFAULT_PLACE_DISPLAY_NAME,
  FALLBACK_REGIONS,
  INATURALIST_PLACES_BY_ID,
} from '@/lib/constants'
import { parseListStateFromSearchParams, buildListStateSearchParams } from '@/lib/listStateParams'
import { sortSpeciesResults } from '@/lib/sortSpeciesResults'

function getPlaceDisplayName (placeId: number): string {
  if (placeId === DEFAULT_PLACE_ID) return DEFAULT_PLACE_DISPLAY_NAME
  return FALLBACK_REGIONS.find((r) => r.id === placeId)?.name ?? `Place ${placeId}`
}

function HomePageContent () {
  const searchParams = useSearchParams()
  const initial = useMemo(
    () => parseListStateFromSearchParams(searchParams),
    [searchParams]
  )

  const [placeId, setPlaceIdState] = useState(initial.placeId)
  const [placeDisplayName, setPlaceDisplayName] = useState(() => getPlaceDisplayName(initial.placeId))
  const [page, setPage] = useState(initial.page)
  const [search, setSearch] = useState(initial.search)
  const [filterSpeciesClass, setFilterSpeciesClass] = useState(initial.filterSpeciesClass)
  const [filterEndemic, setFilterEndemic] = useState(initial.filterEndemic)
  const [orderBy, setOrderBy] = useState<OrderByOption>(initial.orderBy)
  const { showButton: showScrollToTop, scrollToTop } = useScrollToTop(SCROLL_TO_TOP_THRESHOLD)
  const hasAttemptedGeoRef = useRef(false)
  const [downloadModalOpen, setDownloadModalOpen] = useState(false)

  useEffect(() => {
    const queryString = buildListStateSearchParams({
      placeId,
      page,
      search,
      orderBy,
      filterEndemic,
      filterSpeciesClass,
    })
    const url = `${window.location.pathname}${queryString}`
    if (window.location.pathname + window.location.search !== url) {
      window.history.replaceState(null, '', url)
    }
  }, [placeId, page, search, orderBy, filterEndemic, filterSpeciesClass])

  const setSearchAndResetPage = useCallback((value: SetStateAction<string>) => {
    setSearch(value)
    setPage(1)
  }, [])

  const setPlace = useCallback((id: number, displayName: string) => {
    setPlaceIdState(id)
    setPlaceDisplayName(displayName)
    setPage(1)
  }, [])

  useEffect(() => {
    if (hasAttemptedGeoRef.current || placeId !== DEFAULT_PLACE_ID) return
    hasAttemptedGeoRef.current = true
    let cancelled = false
    fetch('/api/geo')
      .then((res) => res.json() as Promise<GeoResponse>)
      .then((data) => {
        if (cancelled) return
        if (data?.suggestedPlaceId != null && data?.suggestedPlaceName != null) {
          setPlace(data.suggestedPlaceId, data.suggestedPlaceName)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [placeId, setPlace])

  const setOrderByAndResetPage = useCallback((value: SetStateAction<OrderByOption>) => {
    setOrderBy(value)
    setPage(1)
  }, [])

  const setFilterEndemicAndResetPage = useCallback((value: SetStateAction<boolean>) => {
    setFilterEndemic(value)
    setPage(1)
  }, [])

  const setFilterSpeciesClassAndResetPage = useCallback((value: SetStateAction<string>) => {
    setFilterSpeciesClass(value)
    setPage(1)
  }, [])

  const resetFiltersAndOrder = useCallback(() => {
    setOrderBy('count_desc')
    setFilterEndemic(false)
    setFilterSpeciesClass('')
    setPage(1)
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

  useEffect(() => {
    if (numberOfPages >= 1 && page > numberOfPages) {
      queueMicrotask(() => setPage(numberOfPages))
    }
  }, [numberOfPages, page])

  const sortedResults = useMemo((): SpeciesCountResult[] | undefined => {
    const results = data?.results
    if (results == null) return undefined
    return sortSpeciesResults(results, orderBy)
  }, [data?.results, orderBy])

  if (status === 'error') return <p>{status}</p>

  return (
    <>
      <h1 className="title title-hero mb-2">Taxonomy Explorer</h1>
      <p className="subtitle text-center mx-auto mb-12">Explore the taxonomy of species in your area</p>
      <div className="flex flex-col items-center w-full p-6 pb-16 bg-level-2 rounded">
        <div className="toolbar mb-4">
          <Search search={search} setSearch={setSearchAndResetPage} />
          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="action-button"
            aria-label="Download"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </div>

        <DownloadModal
          open={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          species={sortedResults ?? []}
          totalResults={data != null && !('error' in data) ? (data.total_results ?? 0) : 0}
          exportParams={{
            placeId,
            search,
            filterEndemic,
            filterSpeciesClass,
            orderBy,
          }}
        />

        <Filters
          placeId={placeId}
          placeDisplayName={placeDisplayName}
          onPlaceSelect={setPlace}
          orderBy={orderBy}
          setOrderBy={setOrderByAndResetPage}
          filterEndemic={filterEndemic}
          setFilterEndemic={setFilterEndemicAndResetPage}
          filterSpeciesClass={filterSpeciesClass}
          setFilterSpeciesClass={setFilterSpeciesClassAndResetPage}
          onResetFilters={resetFiltersAndOrder}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8 w-full">
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
                        <p>{name}</p>
                        <p>Taxonomy: {iconic_taxon_name}</p>
                        <p>Observations: {s.count}</p>
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
