'use client'

import { useState, useCallback } from 'react'
import type { SpeciesCountResult, OrderByOption } from '@/types'
import downloadCsv from '@/lib/downloadCsv'
import downloadJson from '@/lib/downloadJson'
import downloadTsv from '@/lib/downloadTsv'
import { XIcon } from '@/components/Icons'

export type ExportScope = 'page' | 'all'
export type ExportFormat = 'csv' | 'json' | 'tsv'

export interface ExportParams {
  placeId: number
  search: string
  filterEndemic: boolean
  filterSpeciesClass: string
  orderBy: OrderByOption
}

export interface DownloadModalProps {
  open: boolean
  onClose: () => void
  species: SpeciesCountResult[]
  totalResults: number
  exportParams: ExportParams
}

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'csv', label: 'CSV' },
  { id: 'json', label: 'JSON' },
  { id: 'tsv', label: 'TSV' },
]

function buildExportUrl (params: ExportParams): string {
  const q = new URLSearchParams()
  q.set('place_id', String(params.placeId))
  if (params.search) q.set('q', params.search)
  q.set('endemic', String(params.filterEndemic))
  if (params.filterSpeciesClass) q.set('taxon', params.filterSpeciesClass)
  q.set('order', params.orderBy)
  return `/api/export?${q.toString()}`
}

export default function DownloadModal ({
  open,
  onClose,
  species,
  totalResults,
  exportParams,
}: DownloadModalProps) {
  const [scope, setScope] = useState<ExportScope>('page')
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = useCallback(async () => {
    setError(null)
    let data: SpeciesCountResult[] = species

    if (scope === 'all') {
      setLoading(true)
      try {
        const url = buildExportUrl(exportParams)
        const res = await fetch(url)
        const json = await res.json()
        if (!res.ok) {
          setError(json?.error ?? 'Export failed')
          return
        }
        data = json.results ?? []
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Export failed')
        return
      } finally {
        setLoading(false)
      }
    }

    if (data.length === 0) {
      setError('No data to download')
      return
    }

    if (format === 'csv') downloadCsv(data)
    else if (format === 'json') downloadJson(data)
    else downloadTsv(data)
    onClose()
  }, [scope, format, species, exportParams, onClose])

  if (!open) return null

  const currentPageSize = species.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-lg border border-level-4 bg-level-2 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 id="download-modal-title" className="text-xl font-semibold text-primary">
            Download export
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-level-3 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-cta"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-secondary mb-4">
          Choose what to export and in which format.
        </p>

        <fieldset className="mb-4">
          <legend className="text-sm font-medium text-primary mb-2">Scope</legend>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="page"
                checked={scope === 'page'}
                onChange={() => setScope('page')}
                className="text-cta focus:ring-cta"
              />
              <span className="text-primary">
                Current page ({currentPageSize.toLocaleString()} species)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="scope"
                value="all"
                checked={scope === 'all'}
                onChange={() => setScope('all')}
                className="text-cta focus:ring-cta"
              />
              <span className="text-primary">
                All results ({totalResults.toLocaleString()} species)
              </span>
            </label>
          </div>
          {scope === 'all' && (
            <p className="text-xs text-secondary mt-1">
              This may take a moment for large result sets.
            </p>
          )}
        </fieldset>

        <fieldset className="mb-6">
          <legend className="text-sm font-medium text-primary mb-2">Format</legend>
          <div className="flex flex-wrap gap-3">
            {FORMATS.map((f) => (
              <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={f.id}
                  checked={format === f.id}
                  onChange={() => setFormat(f.id)}
                  className="text-cta focus:ring-cta"
                />
                <span className="text-primary">{f.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error != null && (
          <p className="text-sm text-red-500 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-level-4 bg-level-3 text-primary hover:bg-level-4 focus:outline-none focus:ring-2 focus:ring-cta"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { void handleDownload() }}
            disabled={loading}
            className="px-4 py-2 rounded bg-cta text-cta-contrast font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-level-2 disabled:opacity-50"
          >
            {loading ? 'Preparing…' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}
