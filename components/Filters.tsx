'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { FiltersProps, PlaceAutocompleteResult, OrderByOption, GeoResponse, PlacesAutocompleteResponse } from '@/types'
import {
  FALLBACK_REGIONS,
  PLACES_AUTOCOMPLETE_BASE_URL,
  SPECIES_CLASS_OPTIONS,
  WORLD_PLACE_ID,
  WORLD_PLACE_DISPLAY_NAME,
  TAXA_BASE_URL,
  KINGDOM_OPTIONS,
} from '@/lib/constants'
import fetchApi from '@/lib/fetchApi'
import { ChevronDown, ChevronUp } from '@/components/Icons'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { TaxaResponse } from '@/types'

const PLACE_SEARCH_MIN_LENGTH = 2
const PLACE_SEARCH_DEBOUNCE_MS = 300

/** Capitalize first letter of each word for display labels. */
function capitalizeWords (s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/** Format taxon option label: "Latin (English)" when both present, else the one we have; capitalized. */
function formatTaxonLabel (latinName?: string | null, englishName?: string | null): string {
  const latin = (latinName ?? '').trim()
  const english = (englishName ?? '').trim()
  if (latin && english && latin !== english) {
    return `${capitalizeWords(latin)} (${capitalizeWords(english)})`
  }
  return capitalizeWords(latin || english)
}

export default function Filters({
  placeId,
  placeDisplayName,
  onPlaceSelect,
  orderBy,
  setOrderBy,
  filterEndemic,
  setFilterEndemic,
  filterThreatened,
  setFilterThreatened,
  filterSpeciesClass,
  setFilterSpeciesClass,
  filterTaxonId,
  setFilterTaxonId,
  onResetFilters,
}: FiltersProps) {
  const [placeQuery, setPlaceQuery] = useState('')
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceAutocompleteResult[]>([])
  const [placeSuggestionsOpen, setPlaceSuggestionsOpen] = useState(false)
  const [placeSearchLoading, setPlaceSearchLoading] = useState(false)
  const [suggestedRegion, setSuggestedRegion] = useState<{ id: number; name: string } | null>(null)
  const [geoLoaded, setGeoLoaded] = useState(false)
  const [locationExpanded, setLocationExpanded] = useLocalStorage('taxo.locationExpanded', true)
  const [filterExpanded, setFilterExpanded] = useLocalStorage('taxo.filterExpanded', true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasActiveFilters =
    orderBy !== 'count_desc' || filterEndemic || filterThreatened || filterSpeciesClass !== '' || filterTaxonId != null

  const isWorld = placeId === WORLD_PLACE_ID

  useEffect(() => {
    if (isWorld && filterEndemic) setFilterEndemic(false)
  }, [isWorld, filterEndemic, setFilterEndemic])

  useEffect(() => {
    if (geoLoaded) return
    let cancelled = false
    fetch('/api/geo')
      .then((res) => res.json() as Promise<GeoResponse>)
      .then((data) => {
        if (cancelled) return
        setGeoLoaded(true)
        if (data?.suggestedPlaceId != null && data?.suggestedPlaceName != null) {
          setSuggestedRegion({ id: data.suggestedPlaceId, name: data.suggestedPlaceName })
        }
      })
      .catch(() => {
        if (!cancelled) setGeoLoaded(true)
      })
    return () => { cancelled = true }
  }, [geoLoaded])

  const fetchPlaces = useCallback(async (q: string) => {
    if (q.length < PLACE_SEARCH_MIN_LENGTH) {
      setPlaceSuggestions([])
      return
    }
    setPlaceSearchLoading(true)
    try {
      const url = `${PLACES_AUTOCOMPLETE_BASE_URL}?q=${encodeURIComponent(q)}`
      const res = await fetchApi<PlacesAutocompleteResponse>(url)
      setPlaceSuggestions(res?.results ?? [])
      setPlaceSuggestionsOpen(true)
    } catch {
      setPlaceSuggestions([])
    } finally {
      setPlaceSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (placeQuery.length < PLACE_SEARCH_MIN_LENGTH) {
      setPlaceSuggestions([])
      setPlaceSuggestionsOpen(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      void fetchPlaces(placeQuery)
    }, PLACE_SEARCH_DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [placeQuery, fetchPlaces])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current != null && !wrapperRef.current.contains(e.target as Node)) {
        setPlaceSuggestionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPlace = useCallback((place: PlaceAutocompleteResult) => {
    const id = place.id
    const name = place.display_name ?? place.name ?? `Place ${id}`
    onPlaceSelect(id, name)
    setPlaceQuery('')
    setPlaceSuggestions([])
    setPlaceSuggestionsOpen(false)
  }, [onPlaceSelect])

  const { data: phylaData } = useQuery<TaxaResponse>({
    queryKey: ['taxa', 'phylum'],
    queryFn: () =>
      fetchApi<TaxaResponse>(`${TAXA_BASE_URL}?rank=phylum&per_page=100&order_by=observations_count&order=desc`),
    enabled: filterExpanded,
  })
  const phylumOptions: { id: number; displayLabel: string }[] =
    phylaData?.results?.map((t) => ({
      id: t.id,
      displayLabel: formatTaxonLabel(t.name, t.preferred_common_name),
    })) ?? []

  const { data: familiesData } = useQuery<TaxaResponse>({
    queryKey: ['taxa', 'family'],
    queryFn: () =>
      fetchApi<TaxaResponse>(`${TAXA_BASE_URL}?rank=family&per_page=150&order_by=observations_count&order=desc`),
    enabled: filterExpanded,
  })
  const familyOptions: { id: number; displayLabel: string }[] =
    familiesData?.results?.map((t) => ({
      id: t.id,
      displayLabel: formatTaxonLabel(t.name, t.preferred_common_name),
    })) ?? []

  const sanitizedClass = filterSpeciesClass === '' ? 'all' : filterSpeciesClass

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setFilterSpeciesClass(value === 'all' ? '' : value)
  }

  const headerButtonClass =
    'flex items-center justify-between gap-2 py-3.5 px-4 border-0 bg-level-1 cursor-pointer font-medium text-left hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-level-1'

  return (
    <>
      {/* Section 1: Location */}
      <div className={`card border border-level-3 !bg-level-2 mb-4 w-full overflow-visible ${!locationExpanded ? '!pb-0' : ''}`}>
        <button
          type="button"
          onClick={() => setLocationExpanded((e) => !e)}
          className={`${headerButtonClass} w-[calc(100%+3rem)] -mx-6 -mt-6 block rounded-t`}
          aria-expanded={locationExpanded}
        >
          <span>Location</span>
          {locationExpanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
        </button>
        {locationExpanded && (
          <section className="pt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => onPlaceSelect(WORLD_PLACE_ID, WORLD_PLACE_DISPLAY_NAME)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${placeId === WORLD_PLACE_ID
                    ? 'bg-cta text-cta-contrast border-cta'
                    : 'bg-level-3 border-level-4 hover:border-cta'
                  }`}
              >
                {WORLD_PLACE_DISPLAY_NAME}
              </button>
              {!geoLoaded && (
                <span className="text-sm text-secondary">Detecting your region…</span>
              )}
              {geoLoaded && suggestedRegion != null && (
                <button
                  type="button"
                  onClick={() => onPlaceSelect(suggestedRegion.id, suggestedRegion.name)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${placeId === suggestedRegion.id
                      ? 'bg-cta text-cta-contrast border-cta'
                      : 'bg-level-3 border-level-4 hover:border-cta'
                    }`}
                >
                  Your region: {suggestedRegion.name}
                </button>
              )}
              {geoLoaded && FALLBACK_REGIONS.filter((r) => suggestedRegion == null || r.id !== suggestedRegion.id).map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => onPlaceSelect(region.id, region.name)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${placeId === region.id
                      ? 'bg-cta text-cta-contrast border-cta'
                      : 'bg-level-3 border-level-4 hover:border-cta'
                    }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
            <div ref={wrapperRef} className="relative">
              <label htmlFor="place-search" className="sr-only">Search for a place</label>
              <input
                id="place-search"
                type="text"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                onFocus={() => placeSuggestions.length > 0 && setPlaceSuggestionsOpen(true)}
                placeholder="Search for a place…"
                className="input w-full max-w-md"
                autoComplete="off"
              />
              {placeSearchLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary">Searching…</span>
              )}
              {placeSuggestionsOpen && placeSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 left-0 right-0 mt-1 max-h-48 overflow-auto rounded border border-level-4 bg-level-2 shadow-lg"
                  role="listbox"
                >
                  {placeSuggestions.map((place) => (
                    <li
                      key={place.id}
                      role="option"
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-level-4 border-b border-level-3 last:border-b-0"
                      onClick={() => handleSelectPlace(place)}
                    >
                      {place.display_name ?? place.name ?? `Place ${place.id}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-sm text-secondary mt-2">Current: {placeDisplayName}</p>
          </section>
        )}
      </div>

      {/* Section 2: Filters */}
      <div className={`card !bg-level-2 mb-8 w-full overflow-visible ${!filterExpanded ? '!pb-0' : ''}`}>
        <button
          type="button"
          onClick={() => setFilterExpanded((e) => !e)}
          className={`${headerButtonClass} w-[calc(100%+3rem)] -mx-6 -mt-6 block rounded-t`}
          aria-expanded={filterExpanded}
        >
          <span>Filters</span>
          {filterExpanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
        </button>
        {filterExpanded && (
          <div className="flex flex-col md:flex-row md:gap-6 pt-2 mt-2">
            <section className="mb-6 md:mb-0 md:min-w-0 md:flex-[2]">
              <p className="font-medium mb-1">Filter per taxonomy class:</p>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-x-4 gap-y-1 mt-2 text-sm">
                {SPECIES_CLASS_OPTIONS.map((c) => (
                  <li key={c}>
                    <label htmlFor={c} className="cursor-pointer flex items-center gap-2 capitalize whitespace-nowrap">
                      <input type="radio" id={c} value={c} checked={c === sanitizedClass} onChange={handleChange} className="radio" />
                      {c}
                    </label>
                  </li>
                ))}
              </ul>

              <p className="font-medium mb-1 mt-6">Filter by taxon (Kingdom, Phylum, Family):</p>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 md:items-center text-sm w-full">
                <label className="flex items-center gap-2 w-full md:w-auto min-w-0">
                  <span className="text-secondary shrink-0 w-20 md:w-auto">Kingdom</span>
                  <select
                    value={filterTaxonId != null && KINGDOM_OPTIONS.some((k) => k.id === filterTaxonId) ? filterTaxonId : ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilterTaxonId(v === '' ? null : parseInt(v, 10))
                    }}
                    className="input py-1 pr-6 flex-1 min-w-0 md:max-w-[12rem] md:flex-none"
                  >
                    <option value="">Any</option>
                    {KINGDOM_OPTIONS.map((k) => (
                      <option key={k.id} value={k.id}>{capitalizeWords(k.name)}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 w-full md:w-auto min-w-0">
                  <span className="text-secondary shrink-0 w-20 md:w-auto">Phylum</span>
                  <select
                    value={filterTaxonId != null && phylumOptions.some((p) => p.id === filterTaxonId) ? filterTaxonId : ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilterTaxonId(v === '' ? null : parseInt(v, 10))
                    }}
                    className="input py-1 pr-6 flex-1 min-w-0 md:max-w-[12rem] md:flex-none"
                  >
                    <option value="">Any</option>
                    {phylumOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.displayLabel}</option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 w-full md:w-auto min-w-0">
                  <span className="text-secondary shrink-0 w-20 md:w-auto">Family</span>
                  <select
                    value={filterTaxonId != null && familyOptions.some((f) => f.id === filterTaxonId) ? filterTaxonId : ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setFilterTaxonId(v === '' ? null : parseInt(v, 10))
                    }}
                    className="input py-1 pr-6 flex-1 min-w-0 md:max-w-[12rem] md:flex-none"
                  >
                    <option value="">Any</option>
                    {familyOptions.map((f) => (
                      <option key={f.id} value={f.id}>{f.displayLabel}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <label
                htmlFor="endemic"
                className={`flex items-center gap-2 text-sm ${isWorld ? 'cursor-default opacity-60' : 'cursor-pointer'}`}
                title={isWorld ? 'Endemic filter only applies when a specific region is selected' : undefined}
              >
                <input
                  type="checkbox"
                  id="endemic"
                  className="checkbox relative bottom-[1px]"
                  onChange={() => setFilterEndemic((current) => !current)}
                  checked={filterEndemic}
                  disabled={isWorld}
                />
                {' '}Only display endemic species
              </label>
              <label
                htmlFor="threatened"
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="threatened"
                  className="checkbox relative bottom-[1px]"
                  onChange={() => setFilterThreatened((current) => !current)}
                  checked={filterThreatened}
                />
                {' '}Only display endangered species
              </label>
            </div>
            </section>
            <section className="md:min-w-0 md:flex-1">
              <p className="font-medium mb-1">Order by:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-2 mt-2 text-sm">
                {[
                  { value: 'count_desc' as OrderByOption, label: 'Count (high to low)' },
                  { value: 'count_asc' as OrderByOption, label: 'Count (low to high)' },
                  { value: 'name_asc' as OrderByOption, label: 'Name (A–Z)' },
                  { value: 'name_desc' as OrderByOption, label: 'Name (Z–A)' },
                ].map(({ value, label }) => (
                  <li key={value} className="min-w-0">
                    <label htmlFor={`order-${value}`} className="cursor-pointer flex items-center gap-2">
                      <input
                        type="radio"
                        id={`order-${value}`}
                        name="orderBy"
                        value={value}
                        checked={orderBy === value}
                        onChange={() => setOrderBy(value)}
                        className="radio"
                      />
                      {label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
        {filterExpanded && (
          <div className="flex justify-end w-full mt-4">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className={`link text-sm bg-transparent border-0 p-0 ${hasActiveFilters ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}
