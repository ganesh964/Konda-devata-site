import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { Music2, Volume2, VolumeX } from 'lucide-react'

const AUDIO_SOURCES = [
  '/audio/vepa-chettuku-uyyala.mp3',
  '/audio/Vepa-Chettuku-Uyyala.mp3',
]

const TARGET_VOLUME = 0.28

export function BackgroundAmbience() {
  const howlRef = useRef<Howl | null>(null)

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('ambience-muted') === 'true'
    } catch {
      return false
    }
  })

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const sound = new Howl({
      src: AUDIO_SOURCES,
      loop: true,
      volume: TARGET_VOLUME,
      html5: true,
      preload: true,

      onload: () => {
        setReady(true)
      },

      onplay: () => {
        setPlaying(true)
      },

      onstop: () => {
        setPlaying(false)
      },

      onpause: () => {
        setPlaying(false)
      },

      onloaderror: (_id, err) => {
        console.warn('Audio failed:', err)
      },
    })

    howlRef.current = sound

    return () => {
      sound.stop()
      sound.unload()
    }
  }, [])

  // Start audio after first user interaction
  useEffect(() => {
    if (!ready || muted) return

    const sound = howlRef.current

    if (!sound) return

    const startAudio = () => {
      if (!sound.playing()) {
        sound.play()
      }
    }

    window.addEventListener('click', startAudio, { once: true })

    return () => {
      window.removeEventListener('click', startAudio)
    }
  }, [ready, muted])

  const toggleMute = () => {
    const sound = howlRef.current

    if (!sound) return

    if (muted) {
      // UNMUTE
      setMuted(false)

      localStorage.setItem('ambience-muted', 'false')

      sound.volume(TARGET_VOLUME)

      if (!sound.playing()) {
        sound.play()
      }
    } else {
      // MUTE
      setMuted(true)

      localStorage.setItem('ambience-muted', 'true')

      sound.stop()
    }
  }

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed bottom-20 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-saffron-200/40 bg-white/90 text-saffron-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white dark:border-gold-400/20 dark:bg-dev-card-dark/90 dark:text-gold-400 lg:bottom-6"
    >
      {muted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}

      {playing && !muted && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-saffron-500" />
        </span>
      )}

      {!ready && (
        <Music2 className="absolute bottom-1 right-1 h-3 w-3 opacity-40" />
      )}
    </button>
  )
}