import Link from 'next/link'
import type { ReactNode } from 'react'

type AppLinkProps = {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
}

export default function AppLink ({ href, children, className, prefetch = true }: AppLinkProps) {
  const internal = href.startsWith('/')

  if (internal) {
    return (
      <Link href={href} className={className} prefetch={prefetch}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
