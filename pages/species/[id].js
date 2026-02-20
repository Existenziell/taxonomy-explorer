import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { SyncLoader } from 'react-spinners'
import Head from 'next/head'
import Image from 'next/image'
import translateStatusName from '../../lib/translateStatusName'
import BackBtn from '../../components/BackBtn'
import fetchApi from '../../lib/fetchApi'

const Species = () => {
  const router = useRouter()
  const { id } = router.query

  const { status, data } = useQuery(["species", id], () =>
    fetchApi(`https://api.inaturalist.org/v1/taxa/${id}`),
  )

  if (status === "error") return <p>{status}</p>
  if (status === 'loading') return <div className='mx-auto w-max mt-16'><SyncLoader size={10} color='var(--color-cta)' /></div>

  const { name, preferred_common_name, iconic_taxon_name, observations_count, conservation_status, taxon_photos, extinct, wikipedia_url, wikipedia_summary } = data.results.at(0)

  return (
    <>
      <Head>
        <title>{`${name} | Cozumel Taxonomy`}</title>
        <meta name="description" content={`${name} | Cozumel Taxonomy`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center px-16 w-full">
        <BackBtn href='/' />

        <h1 className="text-4xl mb-8">{preferred_common_name}</h1>

        <div className="flex flex-col items-center w-full">
          <div className="mb-8 max-w-max">
            <p>Latin Name: {name}</p>
            <p>Taxonomy: {iconic_taxon_name}</p>
            <p>Number of observations: {observations_count}</p>
            <p>Status: {conservation_status?.status_name ? translateStatusName(conservation_status.status_name) : "No data"}</p>
            {extinct ? <p>Species has become extinct...</p> : ``}
          </div>

          <span dangerouslySetInnerHTML={{ __html: wikipedia_summary }} className='text-center' />
          {wikipedia_url &&
            <a href={wikipedia_url} target="_blank" rel="noopener noreferrer nofollow" className="link inline-block text-xs mt-2 mb-8">More information</a>
          }

          <div className='nextimg shadow-lg'>
            <Image
              src={taxon_photos.at(0).photo.large_url}
              width={taxon_photos.at(0).photo.original_dimensions.width}
              height={taxon_photos.at(0).photo.original_dimensions.height}
              placeholder='blur'
              alt={iconic_taxon_name}
              blurDataURL={taxon_photos.at(0).photo.large_url}
              className='rounded'
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Species
