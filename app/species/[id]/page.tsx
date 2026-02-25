'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { SyncLoader } from 'react-spinners'
import { useEffect, useState } from 'react'
import Image from '@/components/Image'
import translateStatusName from '@/lib/translateStatusName'
import AppLink from '@/components/AppLink'
import Arrow from '@/components/Arrow'
import fetchApi from '@/lib/fetchApi'
import { getIucnFromStatuses } from '@/lib/iucn'
import { SITE_TITLE } from '@/lib/metadata'
import type { TaxaResponse, Taxon } from '@/types'
import capitalize from '@/lib/capitalize'

function establishmentLabel(taxon: Taxon): string | null {
  const preferred = taxon.preferred_establishment_means
  if (preferred != null && preferred !== '') return preferred
  const means = taxon.establishment_means?.establishment_means
  if (means != null && means !== '') return means
  return null
}

export default function SpeciesPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params?.id === 'string' ? params.id : undefined

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const { status, data } = useQuery<TaxaResponse>({
    queryKey: ['species', id],
    queryFn: () => fetchApi<TaxaResponse>(`https://api.inaturalist.org/v1/taxa/${id}`),
    enabled: id != null && id.length > 0,
  })

  const taxon = data?.results?.[0]

  useEffect(() => {
    if (taxon?.name != null) {
      document.title = `${taxon.name} | ${SITE_TITLE}`
    }
  }, [taxon?.name])

  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (fullscreenImageUrl != null) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [fullscreenImageUrl])

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
    conservation_statuses,
    taxon_photos,
    default_photo,
    extinct,
    wikipedia_url,
    wikipedia_summary,
    is_active,
    colors,
  } = taxon

  const photo = taxon_photos?.[0]?.photo ?? default_photo
  const photoUrl = photo && 'large_url' in photo ? photo.large_url : photo?.medium_url
  const hasConservation =
    extinct === true ||
    (conservation_status?.status_name != null && conservation_status.status_name !== '') ||
    (conservation_statuses != null && conservation_statuses.length > 0) ||
    establishmentLabel(taxon) != null
  const establishment = establishmentLabel(taxon)
  const iucn = getIucnFromStatuses(conservation_statuses ?? null)

  const openFullscreen = (url: string) => setFullscreenImageUrl(url)
  const closeFullscreen = () => setFullscreenImageUrl(null)
  const displayName = capitalize(preferred_common_name ?? name) ?? ''

  const ancestors = taxon.ancestors ?? []
  const taxonomyRows = [...ancestors, taxon]
  const hasTaxonomy = taxonomyRows.length > 0

  return (

    <>

      <h1 className="title mb-2 text-center">{displayName}</h1>
      <p className="body leading-relaxed mb-8 text-center">
        {name}<br />
        {iconic_taxon_name}
      </p>
      <div className="flex flex-col items-center p-6 w-full bg-level-2 relative rounded">
        <div className="absolute left-2 -top-16">
          <Arrow direction="left" onClick={handleBack} ariaLabel="Back to list" />
        </div>


        <div className="flex flex-col w-full gap-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taxonomy tree */}
            <section className="card card-compact" aria-labelledby="taxonomy-heading" aria-label="Taxonomic hierarchy">
              <h2 id="taxonomy-heading" className="section-heading">
                Taxonomy
              </h2>
              {hasTaxonomy ? (
                <ul className="border-l-2 border-level-4 pl-4 space-y-1.5 text-sm" role="list">
                  {taxonomyRows.map((row, index) => {
                    const isLast = index === taxonomyRows.length - 1
                    const branch = isLast ? '└' : '├'
                    const rankLabel = row.rank != null ? capitalize(row.rank) : '—'
                    const rowName = row.preferred_common_name ?? row.name ?? '—'
                    const isCurrent = row.id === taxon.id
                    return (
                      <li key={row.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-level-5 select-none" aria-hidden="true">{branch}</span>
                        <span className="text-secondary min-w-[5.5rem]">{rankLabel}</span>
                        {ancestors.some(a => a.id === row.id) ? (
                          <AppLink href={`/species/${row.id}`} className="link">
                            {rowName}
                          </AppLink>
                        ) : (
                          <span className={isCurrent ? 'font-medium text-cta' : undefined}>{rowName}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-sm text-secondary">No taxonomy data available.</p>
              )}
            </section>

            {/* Conservation, establishment and observations */}
            <section className="card card-compact" aria-labelledby="conservation-heading">
              <p className="section-heading" id="observations-heading">Observations and activity</p>
              <p className="text-sm">Observations: {observations_count ?? 'No data'}</p>
              {is_active !== undefined && (
                <p className="text-sm">Name status: {is_active === true ? 'Accepted name' : 'Inactive (synonym)'}</p>
              )}

              <p className="section-heading mt-6" id="conservation-heading">Conservation and establishment</p>
              <div className="mt-2 max-h-64 overflow-y-auto overflow-x-hidden rounded-md">
                {hasConservation ? (
                  <>
                    {extinct === true && (
                      <p className="text-sm mb-1">This species has become extinct.</p>
                    )}
                    <p className="text-sm">
                      Status:{' '}
                      {conservation_status?.status_name != null && conservation_status.status_name !== ''
                        ? translateStatusName(conservation_status.status_name)
                        : 'No data'}
                    </p>
                    {iucn != null && (
                      <p className="text-sm mt-1">IUCN: {iucn.label}</p>
                    )}
                    {conservation_statuses != null && conservation_statuses.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-0.5">Conservation statuses:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-sm">
                          {conservation_statuses.map((cs, i) => (
                            <li key={i}>
                              {cs.status_name ?? cs.status ?? '—'}
                              {cs.authority != null && cs.authority !== '' && ` (${cs.authority})`}
                              {cs.place?.display_name != null && cs.place.display_name !== '' && ` — ${cs.place.display_name}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {establishment != null && (
                      <p className="text-sm mt-1">Establishment: {establishment}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-secondary">No conservation or establishment data.</p>
                )}
              </div>
            </section>
          </div>

          {/* Description */}
          {(wikipedia_summary != null && wikipedia_summary !== '') && (
            <section className="card card-compact" aria-labelledby="description-heading">
              <h2 id="description-heading" className="section-heading">
                Description
              </h2>
              <span
                dangerouslySetInnerHTML={{ __html: wikipedia_summary }}
                className="block text-sm"
              />
              {wikipedia_url != null && wikipedia_url !== '' && (
                <p className="mt-2 text-sm">
                  <AppLink href={wikipedia_url} className="link">
                    More
                  </AppLink>
                </p>
              )}
            </section>
          )}

          {/* Media */}
          <section className="card card-compact" aria-labelledby="media-heading">
            <h2 id="media-heading" className="section-heading">
              Media
            </h2>
            {colors != null && colors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {colors.map((c) => (
                  <span
                    key={c.id}
                    className="tag"
                  >
                    {c.value}
                  </span>
                ))}
              </div>
            )}
            {taxon_photos != null && taxon_photos.length > 1 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
                {taxon_photos.map((tp, i) => {
                  const p = tp.photo
                  if (p?.large_url == null) return null
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => openFullscreen(p.large_url)}
                      className="rounded overflow-hidden bg-level-4 text-left cursor-pointer border-0 p-0 block w-full"
                      aria-label={`View photo ${i + 1} full screen`}
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={p.large_url}
                          fill
                          alt={`${iconic_taxon_name} — photo ${i + 1}`}
                          blurDataURL={p.large_url}
                          className="object-cover rounded"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : photoUrl != null ? (
              <button
                type="button"
                onClick={() => openFullscreen(photoUrl)}
                className="rounded overflow-hidden bg-level-4 border-0 p-0 block w-full cursor-pointer"
                aria-label="View photo full screen"
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={photoUrl}
                    fill
                    alt={iconic_taxon_name}
                    blurDataURL={photoUrl}
                    className="object-cover rounded"
                    sizes="(max-width: 1024px) 100vw, 672px"
                  />
                </div>
              </button>
            ) : null}
            {photoUrl == null && (!taxon_photos || taxon_photos.length === 0) && (!colors || colors.length === 0) && (
              <p className="text-sm">No media available.</p>
            )}
          </section>

          {/* References */}
          <section className="card card-compact" aria-labelledby="references-heading">
            <h2 id="references-heading" className="section-heading">
              References
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {wikipedia_url != null && wikipedia_url !== '' && (
                <li>
                  <AppLink href={wikipedia_url} className="link">
                    Wikipedia
                  </AppLink>
                </li>
              )}
              {id != null && (
                <li>
                  <AppLink
                    href={`https://www.inaturalist.org/taxa/${id}`}
                    className="link"
                  >
                    iNaturalist
                  </AppLink>
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Fullscreen image lightbox */}
        {fullscreenImageUrl != null && (
          <button
            type="button"
            onClick={closeFullscreen}
            className="overlay"
            aria-label="Close full screen image"
          >
            <div className="relative w-[90vw] h-[90vh]">
              <Image
                src={fullscreenImageUrl}
                alt={iconic_taxon_name ?? 'Species photo'}
                fill
                sizes="90vw"
                className="object-contain cursor-pointer"
              />
            </div>
          </button>
        )}
      </div>
    </>
  )
}
