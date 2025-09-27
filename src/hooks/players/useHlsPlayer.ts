'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'

const isRuntimeTestMode = () => {
  if (typeof window === 'undefined') return false
  return Boolean(
    (window as typeof window & { __STREAM_TEST_MODE__?: boolean })
      .__STREAM_TEST_MODE__,
  )
}

export type PlayerState =
  | 'idle'
  | 'waiting'
  | 'playing'
  | 'blocked'
  | 'unsupported'

export const useHlsPlayer = ({
  sources,
}: {
  sources: readonly (string | null | undefined)[]
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PlayerState>('waiting')

  const filteredSources = useMemo(
    () => sources.filter((source): source is string => Boolean(source)),
    [sources],
  )

  useEffect(() => {
    if (isRuntimeTestMode()) {
      setState('waiting')
      const timer = setTimeout(() => setState('playing'), 200)
      return () => clearTimeout(timer)
    }

    const video = videoRef.current
    if (!video) return

    if (filteredSources.length === 0) {
      setState('idle')
      return
    }

    let destroyed = false
    let hls: Hls | null = null
    let currentIndex = 0

    const cleanupPlayback = () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    const detachListeners = () => {
      video.removeEventListener('error', handleVideoError)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      if (hls) {
        hls.destroy()
        hls = null
      }
    }

    const setWaiting = () => {
      if (!destroyed) setState('waiting')
    }

    const setStateSafe = (next: PlayerState) => {
      if (!destroyed) setState(next)
    }

    const tryPlay = () => {
      const playResult = video.play()
      if (playResult && typeof playResult.then === 'function') {
        playResult
          .then(() => setStateSafe('playing'))
          .catch(() => setStateSafe('blocked'))
        return
      }
      setStateSafe('playing')
    }

    const startPlayback = (url: string) => {
      if (destroyed) return
      detachListeners()
      setWaiting()

      const wireNative = () => {
        video.addEventListener('error', handleVideoError)
        video.addEventListener('loadedmetadata', handleLoadedMetadata, {
          once: true,
        })
        video.src = url
        tryPlay()
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        wireNative()
        return
      }

      if (Hls.isSupported()) {
        detachListeners()
        hls = new Hls({
          lowLatencyMode: true,
          enableWorker: true,
          backBufferLength: 60,
        })
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!destroyed && (data?.fatal ?? false)) handleStreamFailure()
        })
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryPlay()
        })
        video.addEventListener('error', handleVideoError)
        video.addEventListener('loadedmetadata', handleLoadedMetadata, {
          once: true,
        })
        return
      }

      setStateSafe('unsupported')
    }

    const handleStreamFailure = () => {
      if (destroyed) return
      currentIndex += 1
      if (currentIndex >= filteredSources.length) {
        detachListeners()
        cleanupPlayback()
        setStateSafe('idle')
        return
      }
      startPlayback(filteredSources[currentIndex])
    }

    const handleLoadedMetadata = () => {
      setStateSafe('playing')
    }

    const handleVideoError = () => {
      handleStreamFailure()
    }

    startPlayback(filteredSources[currentIndex])

    return () => {
      destroyed = true
      detachListeners()
      cleanupPlayback()
    }
  }, [filteredSources])

  return {
    videoRef,
    state,
  }
}
