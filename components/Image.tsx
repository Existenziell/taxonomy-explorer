import NextImage from 'next/image'
import type { ComponentProps } from 'react'

const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'

type NextImageProps = ComponentProps<typeof NextImage>

type AppImageProps = NextImageProps & {
  wrapperClassName?: string
}

export default function Image ({
  wrapperClassName,
  sizes,
  placeholder = 'blur',
  className,
  ...props
}: AppImageProps) {
  const wrapperClass = `nextimg ${wrapperClassName ?? ''}`.trim()

  return (
    <div className={wrapperClass}>
      <NextImage
        sizes={sizes ?? DEFAULT_SIZES}
        placeholder={placeholder}
        className={className}
        {...props}
      />
    </div>
  )
}
