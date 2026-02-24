'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { SyncLoader } from 'react-spinners'
import { useEffect } from 'react'
import Image from '@/components/Image'
import translateStatusName from '@/lib/translateStatusName'
import AppLink from '@/components/AppLink'
import BackBtn from '@/components/BackBtn'
import fetchApi from '@/lib/fetchApi'
import type { TaxaResponse } from '@/types'

export default function SpeciesPage () {
  const params = useParams()
  const id = typeof params?.id === 'string' ? params.id : undefined

  const { status, data } = useQuery<TaxaResponse>({
    queryKey: ['species', id],
    queryFn: () => fetchApi<TaxaResponse>(`https://api.inaturalist.org/v1/taxa/${id}`),
    enabled: id != null && id.length > 0,
  })

  const taxon = data?.results?.[0]

  useEffect(() => {
    if (taxon?.name != null) {
      document.title = `${taxon.name} | Cozumel Taxonomy`
    }
  }, [taxon?.name])

  if (status === 'error') return <p>{status}</p>
  if (status === 'pending' || taxon == null) {
    return (
      <div className="mx-auto w-max mt-16">
        <SyncLoader size={10} color="var(--color-cta)" />
      </div>
    )
  }

  const {
    name,
    preferred_common_name,
    iconic_taxon_name,
    observations_count,
    conservation_status,
    taxon_photos,
    extinct,
    wikipedia_url,
    wikipedia_summary,
  } = taxon

  const photo = taxon_photos?.[0]?.photo

  return (
    <div className="flex flex-col items-center px-16 w-full">
      <BackBtn href="/" />

      <h1 className="text-4xl mb-8">{preferred_common_name ?? name}</h1>

      <div className="flex flex-col items-center w-full">
        <div className="mb-8 max-w-max">
          <p>Latin Name: {name}</p>
          <p>Taxonomy: {iconic_taxon_name}</p>
          <p>Number of observations: {observations_count}</p>
          <p>
            Status:{' '}
            {conservation_status?.status_name != null
              ? translateStatusName(conservation_status.status_name)
              : 'No data'}
          </p>
          {extinct === true ? <p>Species has become extinct...</p> : null}
        </div>

        {wikipedia_summary != null && wikipedia_summary !== '' && (
          <span
            dangerouslySetInnerHTML={{ __html: wikipedia_summary }}
            className="text-center"
          />
        )}
        {wikipedia_url != null && wikipedia_url !== '' && (
          <AppLink
            href={wikipedia_url}
            className="link inline-block text-xs mt-2 mb-8"
          >
            More information
          </AppLink>
        )}

        {photo != null && (
          <Image
            src={photo.large_url}
            width={photo.original_dimensions?.width ?? 800}
            height={photo.original_dimensions?.height ?? 600}
            alt={iconic_taxon_name}
            blurDataURL={photo.large_url}
            wrapperClassName="shadow-lg"
            className="rounded"
          />
        )}
      </div>
    </div>
  )
}
