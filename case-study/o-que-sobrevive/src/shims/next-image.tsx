import type { ImgHTMLAttributes } from "react"

/**
 * Stand-in for `next/image` so the Lifeline components run outside Next.js.
 * Only the props the Lifeline uses are forwarded; there is no optimisation.
 */
export default function Image({
  src,
  alt,
  width,
  height,
  className,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  return (
    <img src={src} alt={alt} width={width} height={height} className={className} {...rest} />
  )
}
