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
  placeholder,
  className,
  blurDataURL,
  ...props
}: AppImageProps) {
  const effectivePlaceholder = placeholder ?? (blurDataURL != null ? 'blur' : 'empty')
  const image = (
    <NextImage
      sizes={sizes ?? DEFAULT_SIZES}
      placeholder={effectivePlaceholder}
      className={className}
      blurDataURL={blurDataURL}
      {...props}
    />
  )

  if (wrapperClassName) {
    return <div className={wrapperClassName.trim()}>{image}</div>
  }

  return image
}
