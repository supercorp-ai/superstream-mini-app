'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Hls from 'hls.js'

const isRuntimeTestMode = () => {
  if (typeof window === 'undefined') return false
  return Boolean(
    (window as typeof window & { __STREAM_TEST_MODE__?: boolean })
      .__STREAM_TEST_MODE__,
  )
}

type PlayerState = 'idle' | 'waiting' | 'playing' | 'blocked' | 'unsupported'

const STATE_MESSAGES: Record<PlayerState, string> = {
  idle: 'No active stream.',
  waiting: 'Loading shared browser stream…',
  playing: 'Live stream ready',
  blocked: 'Autoplay blocked. Press play on the video to start streaming.',
  unsupported:
    'HLS playback is not supported in this browser. Try Safari or another MSE-capable browser.',
}

export const Player = ({ sources }: { sources: string[] }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [state, setState] = useState<PlayerState>('waiting')

  useEffect(() => {
    if (isRuntimeTestMode()) {
      setState('waiting')
      const timer = setTimeout(() => setState('playing'), 200)
      return () => {
        clearTimeout(timer)
      }
    }

    const video = videoRef.current
    if (!video) return

    const availableSources = sources.filter(Boolean)
    if (availableSources.length === 0) {
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
      video.removeEventListener('loadedmetadata', handleLoaded)
      if (hls) {
        hls.destroy()
        hls = null
      }
    }

    const setWaiting = () => {
      if (!destroyed) setState('waiting')
    }

    const startPlayback = (url: string) => {
      if (destroyed) return
      detachListeners()
      setWaiting()

      const tryPlay = () => {
        const playResult = video.play()
        if (
          playResult &&
          typeof (playResult as Promise<void>).then === 'function'
        ) {
          ;(playResult as Promise<void>)
            .then(() => {
              if (!destroyed) setState('playing')
            })
            .catch(() => {
              if (!destroyed) setState('blocked')
            })
        } else {
          if (!destroyed) setState('playing')
        }
      }

      const wireNative = () => {
        video.addEventListener('error', handleVideoError)
        video.addEventListener('loadedmetadata', handleLoaded, { once: true })
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
          if (!destroyed && (data?.fatal ?? false)) {
            handleStreamFailure()
          }
        })
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryPlay()
        })
        video.addEventListener('error', handleVideoError)
        video.addEventListener('loadedmetadata', handleLoaded, { once: true })
        return
      }

      setState('unsupported')
    }

    const handleLoaded = () => {
      if (!destroyed) setState('playing')
    }

    const handleStreamFailure = () => {
      if (destroyed) return
      currentIndex += 1
      if (currentIndex >= availableSources.length) {
        detachListeners()
        cleanupPlayback()
        setState('idle')
        return
      }
      startPlayback(availableSources[currentIndex])
    }

    const handleVideoError = () => {
      handleStreamFailure()
    }

    startPlayback(availableSources[currentIndex])

    return () => {
      destroyed = true
      detachListeners()
      cleanupPlayback()
    }
  }, [sources])

  const showPlaceholder = state !== 'playing'
  const placeholderMessage = STATE_MESSAGES[state]

  // Narrow inline style types so React.CSSProperties accepts them.
  const containerStyles = useMemo<CSSProperties>(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }),
    [],
  )

  const viewerStyles = useMemo<CSSProperties>(
    () => ({
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 8,
      minHeight: 360,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.04)',
      overflow: 'hidden',
    }),
    [],
  )

  const videoStyles = useMemo<CSSProperties>(
    () => ({
      maxWidth: '100%',
      width: '100%',
      background: '#000',
      display: showPlaceholder ? ('none' as CSSProperties['display']) : 'block',
      borderRadius: 8,
    }),
    [showPlaceholder],
  )

  const placeholderStyles = useMemo<CSSProperties>(
    () => ({
      opacity: 0.7,
      textAlign: 'center',
      padding: '40px 20px',
      display: showPlaceholder ? 'block' : 'none',
    }),
    [showPlaceholder],
  )

  return (
    <div style={containerStyles}>
      <div style={viewerStyles}>
        <video
          ref={videoRef}
          autoPlay
          muted
          controls
          playsInline
          style={videoStyles}
        />
        <div style={placeholderStyles}>{placeholderMessage}</div>
      </div>
      <div
        data-testid="preview-status"
        data-state={state}
        style={{ fontSize: 14, color: 'var(--gray-11)' }}
      >
        {placeholderMessage}
      </div>
    </div>
  )
}
