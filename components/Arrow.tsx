import type { ArrowProps } from '@/types'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@/components/Icons'
import { cn } from '@/lib/cn'

const CHEVRON_MAP = {
  up: ChevronUp,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
} as const

type ArrowDirection = keyof typeof CHEVRON_MAP

const SIZE_SEGMENT = {
  sm: 'px-2 py-1 rounded',
  md: 'px-2.5 py-1.5 rounded-md',
  lg: 'px-3 py-2 rounded-md',
} as const

const SIZE_WRAPPER = {
  sm: 'p-0.5 rounded-md',
  md: 'p-1 rounded-lg',
  lg: 'p-1.5 rounded-lg',
} as const

const SIZE_ICON = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
} as const

type ArrowSize = keyof typeof SIZE_SEGMENT

export default function Arrow({
  direction,
  ariaLabel,
  size = 'md',
  href,
  onClick,
  disabled = false,
  className,
  iconClassName,
}: ArrowProps) {
  if (!href && !onClick) {
    throw new Error('Arrow requires either href or onClick')
  }

  const Chevron = CHEVRON_MAP[direction as ArrowDirection]
  const icon = (
    <Chevron
      className={cn(SIZE_ICON[size as ArrowSize], iconClassName)}
      aria-hidden
    />
  )

  const segmentClass = cn(
    'inline-flex items-center justify-center gap-1.5 text-level-6',
    !disabled && 'cursor-pointer transition-colors hover:bg-level-3/70 hover:text-cta',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-level-2',
    SIZE_SEGMENT[size as ArrowSize],
    className
  )

  const wrapperClass = cn(
    'inline-flex bg-level-2 shadow-inner',
    SIZE_WRAPPER[size as ArrowSize]
  )

  if (href !== undefined) {
    if (href.startsWith('#')) {
      return (
        <div className={wrapperClass}>
          <a href={href} className={segmentClass} aria-label={ariaLabel}>
            {icon}
          </a>
        </div>
      )
    }
    return (
      <div className={wrapperClass}>
        <Link href={href} className={segmentClass} aria-label={ariaLabel}>
          {icon}
        </Link>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={segmentClass}
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    </div>
  )
}
