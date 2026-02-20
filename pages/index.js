import Image from 'next/image'
import Link from 'next/link'
import translateStatusName from '../lib/translateStatusName'
import downloadCsv from '../lib/downloadCsv'
import scrollToTop from '../lib/scrollToTop'
import Pagination from '../components/Pagination'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import fetchApi from '../lib/fetchApi'
import { SyncLoader } from 'react-spinners'
import { AdjustmentsVerticalIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import Filters from '../components/Filters'
import Search from '../components/Search'

const CozumelTaxonomy = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterSpeciesClass, setFilterSpeciesClass] = useState('')
  const [filterEndemic, setFilterEndemic] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const url = `https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&locale=en`
  const { status, data } = useQuery(["species", page, search, filterEndemic, filterSpeciesClass], () =>
    fetchApi(
      search.length
        ? `${url}&page=${page}&endemic=${filterEndemic.toString()}&iconic_taxa=${filterSpeciesClass}&q=${search}`
        : `${url}&page=${page}&endemic=${filterEndemic.toString()}&iconic_taxa=${filterSpeciesClass}`
    ),
  )

  const numberOfPages = Math.ceil(data?.total_results / data?.per_page)

  useEffect(() => {
    document.addEventListener('scroll', function (e) {
      window.scrollY > 800 ? setShowScrollToTop(true) : setShowScrollToTop(false)
    })
  }, [])

  if (status === "error") return <p>{status}</p>

  return (
    <>
      <h1 className="text-4xl mb-8 text-center">Cozumel Taxonomy</h1>
      <div className="flex flex-col items-center w-full pb-16">
        <h2 className="text-center max-w-xl mb-6">
          The following list shows all species that have been observed on Cozumel and is ordered by the number of these observations.
        </h2>

        <div className="flex justify-between w-full mb-4">
          <button onClick={(e) => setShowFilters(!showFilters)} className="flex items-center gap-1 w-max hover:text-cta">
            <AdjustmentsVerticalIcon className='w-6' />
          </button>
          <Search search={search} setSearch={setSearch} />
          <button href="#" onClick={(e) => downloadCsv(data.results)} className="flex items-center gap-1 w-max hover:text-cta">
            <ArrowDownOnSquareIcon className='w-6' />
          </button>
        </div>

        {showFilters &&
          <Filters filterEndemic={filterEndemic} setFilterEndemic={setFilterEndemic} filterSpeciesClass={filterSpeciesClass} setFilterSpeciesClass={setFilterSpeciesClass} />
        }

        {status === "loading" ?
          <div className='mt-8'><SyncLoader size={10} color='var(--color-cta)' /></div>
          :
          <>
            <Pagination data={data?.results} page={page} setPage={setPage} totalResults={data.total_results} numberOfPages={numberOfPages} />
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full'>
              {data?.results?.map(s => {
                const { id, name, preferred_common_name, iconic_taxon_name, conservation_status, extinct, default_photo } = s.taxon
                return (
                  <Link href={`/species/${id}`} key={id + name + preferred_common_name}>
                    <a className="bg-grey dark:bg-grey-dark p-6 cursor-pointer hover:shadow-lg transition-all w-full rounded flex flex-col justify-between">
                      {default_photo?.medium_url ?
                        <div className='nextimg mb-4'>
                          <Image
                            src={default_photo.medium_url}
                            alt={preferred_common_name}
                            layout='responsive'
                            placeholder='blur'
                            width={default_photo.original_dimensions.width}
                            height={default_photo.original_dimensions.height}
                            blurDataURL={default_photo.medium_url}
                            className='shadow rounded'
                          />
                        </div>
                        :
                        <div className="w-24 h-24 text-sm flex items-center justify-center">No image</div>
                      }
                      <div className="text-sm">
                        <h2 className="text-lg font-bold mb-4 capitalize">{preferred_common_name || "No common name available"}</h2>
                        <p>Latin Name: {name}</p>
                        <p>Taxonomy: {iconic_taxon_name}</p>
                        <p>Number of observations: {s.count}</p>
                        <p>Status: {conservation_status?.status_name ? translateStatusName(conservation_status.status_name) : "No data"}</p>
                        {extinct ? <p>Species has become extinct...</p> : ``}
                      </div>
                    </a>
                  </Link>
                )
              })}
            </div>
            <Pagination data={data?.results} page={page} setPage={setPage} numberOfPages={numberOfPages} />
          </>
        }

        {showScrollToTop &&
          <a href="#" onClick={scrollToTop} className="fixed bottom-2 right-2 z-10 cursor-pointer p-2 hover:bg-cta hover:text-white transition-all rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
          </a>
        }
      </div>
    </>
  )
}

export default CozumelTaxonomy
