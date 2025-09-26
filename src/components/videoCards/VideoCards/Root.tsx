'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Flex, IconButton } from '@radix-ui/themes'

export const Root = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)

  const getSlide = useCallback(() => {
    const dvw = window.visualViewport?.width ?? window.innerWidth
    const raw = dvw - 2 * 50
    return Math.min(raw, 400) + 16 * 1.1
  }, [])

  const scrollBy = (delta: number) =>
    ref.current?.scrollBy({ left: delta, behavior: 'smooth' })

  const THRESHOLD = 200
  const [showPrev, setShowPrev] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    const pos = Math.min(Math.max(0, el.scrollLeft), max)

    setShowPrev(pos > THRESHOLD)
    setShowNext(pos < max - THRESHOLD)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update() // initial
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [update])

  const arrowBase: React.CSSProperties = {
    position: 'absolute',
    top: 'calc((100dvh - 115px - 40px) / 2)',
    transform: 'translateY(-50%)',
    zIndex: 999,
    transition: 'opacity 200ms ease',
  }

  return (
    <Flex
      width="100dvw"
      position="relative"
      flexGrow="1"
    >
      <Flex
        ref={ref}
        gap="4"
        flexGrow="1"
        style={{
          padding: '0 100px 40px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          overscrollBehaviorX: 'contain',
          // @ts-expect-error – WebKit pseudo
          '::WebkitScrollbar': { display: 'none' },
        }}
      >
        {children}
      </Flex>

      <IconButton
        aria-label="Scroll to previous"
        size={{
          initial: '3',
          md: '4',
        }}
        radius="full"
        color="gray"
        onClick={() => scrollBy(-getSlide())}
        style={{
          ...arrowBase,
          left: 'var(--space-2)',
          opacity: showPrev ? 1 : 0,
          pointerEvents: showPrev ? 'auto' : 'none',
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        aria-label="Scroll to next"
        size={{
          initial: '3',
          md: '4',
        }}
        radius="full"
        color="gray"
        onClick={() => scrollBy(getSlide())}
        style={{
          ...arrowBase,
          right: 'var(--space-2)',
          opacity: showNext ? 1 : 0,
          pointerEvents: showNext ? 'auto' : 'none',
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Flex>
  )
}
