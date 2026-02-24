'use client'

import { XIcon } from '@/components/Icons'
import type { SearchProps } from '@/types'

export default function Search ({ search, setSearch }: SearchProps) {
  return (
    <div className="search relative w-full max-w-md flex items-center mx-auto">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        name="search"
        placeholder="Search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoCapitalize="none"
        className="w-full pl-3 pr-9 py-2 rounded border border-cta bg-level-3 text-sm focus:outline-none focus:ring-2 focus:ring-cta"
      />
      <button
        onClick={() => setSearch('')}
        className="absolute right-2 text-secondary hover:text-cta h-max"
        aria-label="Reset search"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
