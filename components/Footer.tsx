import AppLink from '@/components/AppLink'
import { GITHUB_URL, CHRISTOF_URL } from '@/lib/constants'

export default function Footer () {
  return (
    <footer
      className="mt-auto w-full border-t border-level-3 bg-level-2 py-6 text-center text-sm text-level-6"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4">
        <span className="text-grey dark:text-grey-dark">Taxonomy Explorer</span>
        <span className="hidden text-level-4 sm:inline" aria-hidden>·</span>
        <AppLink
          href={GITHUB_URL}
          className="no-underline text-grey dark:text-grey-dark hover:text-level-6 transition-colors"
        >
          GitHub
        </AppLink>
        <span className="text-level-4" aria-hidden>·</span>
        <AppLink
          href={CHRISTOF_URL}
          className="no-underline text-grey dark:text-grey-dark hover:text-level-6 transition-colors"
        >
          christof.digital
        </AppLink>
      </div>
    </footer>
  )
}
