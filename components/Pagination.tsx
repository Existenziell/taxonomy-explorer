import Arrow from '@/components/Arrow'
import type { PaginationProps } from '@/types'

export default function Pagination ({
  page,
  setPage,
  numberOfPages,
  totalResults,
  showNoResultsMessage = true,
}: PaginationProps) {
  const isDisabledPrev = page === 1
  const isDisabledNext = numberOfPages <= page

  if (totalResults === 0) {
    if (!showNoResultsMessage) return null
    return <p className="text-sm mt-4">No results found</p>
  }

  return (
    <div className="toolbar mt-4 mb-4">
      <Arrow
        direction="left"
        ariaLabel="Previous page"
        onClick={() => setPage((p) => p - 1)}
        disabled={isDisabledPrev}
      />

      <div className="flex flex-col items-center">
        <p className="text-sm">{page} / {numberOfPages}</p>
      </div>

      <Arrow
        direction="right"
        ariaLabel="Next page"
        onClick={() => setPage((p) => p + 1)}
        disabled={isDisabledNext}
      />
    </div>
  )
}
