'use client'
import React, { useRef, useEffect, useState } from 'react'
import BackgroundVideo from 'next-video/background-video'

interface LazyBackgroundVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: any
  containerStyle?: React.CSSProperties
}

export const LazyBackgroundVideo = ({
  src,
  height,
  width,
  containerStyle = {},
  ...videoProps
}: LazyBackgroundVideoProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '1536px' },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      style={containerStyle}
    >
      {isInView && (
        <BackgroundVideo
          {...videoProps}
          src={src}
        />
      )}
    </div>
  )
}
