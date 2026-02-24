'use client'

import Image from '@/components/Image'
import AppLink from '@/components/AppLink'
import translateStatusName from '@/lib/translateStatusName'
import downloadCsv from '@/lib/downloadCsv'
import scrollToTop from '@/lib/scrollToTop'
import Pagination from '@/components/Pagination'
import { useState } from 'react'
import useScrollToTop from '@/hooks/useScrollToTop'
import { useQuery } from '@tanstack/react-query'
import fetchApi from '@/lib/fetchApi'
import { SyncLoader } from 'react-spinners'
import { ToolsIcon, DownloadIcon, ChevronUp } from '@/components/Icons'
import Filters from '@/components/Filters'
import Search from '@/components/Search'
import type { SpeciesCountsResponse } from '@/types'

export default function HomePage () {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterSpeciesClass, setFilterSpeciesClass] = useState('')
  const [filterEndemic, setFilterEndemic] = useState(false)
  const { showButton: showScrollToTop } = useScrollToTop(800)

  const url = 'https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&locale=en'
  const { status, data } = useQuery<SpeciesCountsResponse>({
    queryKey: ['species', page, search, filterEndemic, filterSpeciesClass],
    queryFn: () =>
      fetchApi<SpeciesCountsResponse>(
        search.length > 0
          ? `${url}&page=${page}&endemic=${filterEndemic.toString()}&iconic_taxa=${filterSpeciesClass}&q=${search}`
          : `${url}&page=${page}&endemic=${filterEndemic.toString()}&iconic_taxa=${filterSpeciesClass}`
      ),
  })

  const numberOfPages =
    data?.per_page != null ? Math.ceil(data.total_results / data.per_page) : 0

  if (status === 'error') return <p>{status}</p>

  return (
    <>
      <h1 className="text-4xl mb-8 text-center">Cozumel Taxonomy</h1>
      <div className="flex flex-col items-center w-full pb-16">
        <h2 className="text-center max-w-xl mb-6">
          The following list shows all species that have been observed on Cozumel and is ordered by the number of these observations.
        </h2>

        <div className="flex justify-between w-full mb-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 w-max hover:text-cta"
          >
            <ToolsIcon className="w-6 h-6" />
          </button>
          <Search search={search} setSearch={setSearch} />
          <button
            type="button"
            onClick={() => {
              if (data?.results != null) downloadCsv(data.results)
            }}
            className="flex items-center gap-1 w-max hover:text-cta"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </div>

        {showFilters && (
          <Filters
            filterEndemic={filterEndemic}
            setFilterEndemic={setFilterEndemic}
            filterSpeciesClass={filterSpeciesClass}
            setFilterSpeciesClass={setFilterSpeciesClass}
          />
        )}

        {status === 'pending'
          ? (
              <div className="mt-8">
                <SyncLoader size={10} color="var(--color-cta)" />
              </div>
            )
          : (
            <>
              <Pagination
                data={data?.results}
                page={page}
                setPage={setPage}
                totalResults={data?.total_results}
                numberOfPages={numberOfPages}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
                {data?.results?.map((s) => {
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
                      className="bg-grey dark:bg-grey-dark p-6 cursor-pointer hover:shadow-lg transition-all w-full rounded flex flex-col justify-between"
                    >
                      {default_photo?.medium_url != null
                        ? (
                            <Image
                              src={default_photo.medium_url}
                              alt={preferred_common_name ?? name}
                              width={default_photo.original_dimensions?.width ?? 400}
                              height={default_photo.original_dimensions?.height ?? 300}
                              blurDataURL={default_photo.medium_url}
                              wrapperClassName="mb-4"
                              className="shadow rounded w-full h-auto"
                            />
                          )
                        : (
                            <div className="w-24 h-24 text-sm flex items-center justify-center">No image</div>
                          )}
                      <div className="text-sm">
                        <h2 className="text-lg font-bold mb-4 capitalize">
                          {preferred_common_name ?? 'No common name available'}
                        </h2>
                        <p>Latin Name: {name}</p>
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
                data={data?.results}
                page={page}
                setPage={setPage}
                numberOfPages={numberOfPages}
              />
            </>
            )}

        {showScrollToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-2 right-2 z-10 cursor-pointer p-2 hover:bg-cta hover:text-white transition-all rounded-sm"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}
      </div>
    </>
  )
}
