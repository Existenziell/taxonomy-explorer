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
        className="input input-search w-full"
      />
      {search.length > 0 && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-2 text-secondary hover:text-cta h-max"
          aria-label="Reset search"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
