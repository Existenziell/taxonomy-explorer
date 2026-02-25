'use client'

type QueryStatusStatus = 'pending' | 'error' | 'success'

interface QueryStatusProps {
  status: QueryStatusStatus
  /** Shown when status is 'error'. Defaults to "Something went wrong." */
  errorMessage?: string
  /** Optional wrapper class for the pending spinner (e.g. for layout). */
  pendingClassName?: string
}

/**
 * Renders loading spinner or error message for React Query status.
 * Returns null when status is 'success' so the parent can render data.
 */
export default function QueryStatus ({ status, errorMessage = 'Something went wrong.', pendingClassName = 'mt-8' }: QueryStatusProps) {
  if (status === 'pending') {
    return (
      <div className={pendingClassName}>
        <div className="spinner mx-auto" role="status" aria-label="Loading" />
      </div>
    )
  }
  if (status === 'error') {
    return <p className="text-secondary">{errorMessage}</p>
  }
  return null
}
