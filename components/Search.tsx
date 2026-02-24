import { XIcon } from '@/components/Icons'
import type { SearchProps } from '@/types'

export default function Search ({ search, setSearch }: SearchProps) {
  return (
    <div className='search relative w-max flex items-center justify-center mx-auto'>
      <input
        type='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        name='search'
        placeholder='Search'
        autoComplete='off'
        autoCorrect='off'
        spellCheck={false}
        autoCapitalize='off'
      />
      <button
        onClick={() => setSearch('')}
        className='absolute right-2 text-brand-dark/20 dark:text-brand/20 hover:text-cta dark:hover:text-cta h-max'
        aria-label='Reset search'
      >
        <XIcon className='w-5 h-5' />
      </button>
    </div>
  )
}
