import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music, Play, Pause, SkipBack, SkipForward, Volume2,
  VolumeX, Heart
} from 'lucide-react'

interface BhajanTrack {
  id: number
  title: string
  deity: string
  singer: string
  duration: string
  audioUrl: string
}

export function Bhajans() {
  const [selectedDeity, setSelectedDeity] = useState('All')
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const deities = ['All', 'Shiva', 'Krishna', 'Ganesha', 'Hanuman', 'Devi']


  const bhajans: BhajanTrack[] = [
    {
      id: 1,
      title: "Shiv Tandav Stotram",
      deity: "Shiva",
      singer: "Traditional Chant",
      duration: "4:32",
      audioUrl: "/audio/shiv-tandav.mp3",
    },
    {
      id: 2,
      title: "Achyutam Keshavam",
      deity: "Krishna",
      singer: "Devotional Chant",
      duration: "3:45",
      audioUrl: "/audio/achyutam-keshavam.mp3",
    },
    {
      id: 3,
      title: "Ganesh Atharvashirsha",
      deity: "Ganesha",
      singer: "Traditional Chant",
      duration: "5:12",
      audioUrl: "/audio/ganesh-atharvashirsha.mp3",
    },
    {
      id: 4,
      title: "Hanuman Chalisa",
      deity: "Hanuman",
      singer: "Devotional Chant",
      duration: "9:20",
      audioUrl: "/audio/hanuman-chalisa.mp3",
    },
    {
      id: 5,
      title: "Mahishasura Mardini Stotram",
      deity: "Devi",
      singer: "Traditional Chant",
      duration: "7:04",
      audioUrl: "/audio/mahishasura-mardini.mp3",
    },
    {
      id: 6,
      title: "Madhurashtakam",
      deity: "Krishna",
      singer: "Devotional Chant",
      duration: "4:15",
      audioUrl: "/audio/madhurashtakam.mp3",
    },
  ];


  const filteredBhajans = selectedDeity === 'All'
    ? bhajans
    : bhajans.filter(b => b.deity === selectedDeity)

  // Handle Play/Pause logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrackIndex])

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleTrackSelect = (index: number) => {
    // If the index in the original list is needed, find the track in bhajans array
    const originalIndex = bhajans.findIndex(b => b.id === filteredBhajans[index].id)
    if (currentTrackIndex === originalIndex) {
      setIsPlaying(prev => !prev)
    } else {
      setCurrentTrackIndex(originalIndex)
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = val
      setCurrentTime(val)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleNext = () => {
    if (currentTrackIndex !== null) {
      const nextIndex = (currentTrackIndex + 1) % bhajans.length
      setCurrentTrackIndex(nextIndex)
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }

  const handlePrev = () => {
    if (currentTrackIndex !== null) {
      const prevIndex = (currentTrackIndex - 1 + bhajans.length) % bhajans.length
      setCurrentTrackIndex(prevIndex)
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }

  const currentTrack = currentTrackIndex !== null ? bhajans[currentTrackIndex] : null

  return (
    <div className="space-y-8 pb-32">
      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNext}
          onError={() => {
            console.error(
              "Audio failed to load:",
              currentTrack.audioUrl
            );
            setIsPlaying(false);
          }}
          preload="metadata"
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 text-white shadow-md">
          <Music className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Bhajans & Devotional Songs</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Immerse yourself in divine sounds, chants, and stotrams</p>
        </div>
      </div>

      {/* Deities Selector */}
      <div className="flex flex-wrap gap-2 border-b border-saffron-100/20 dark:border-maroon-800/20 pb-4">
        {deities.map(deity => (
          <button
            key={deity}
            onClick={() => setSelectedDeity(deity)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${selectedDeity === deity
              ? 'bg-gradient-to-r from-saffron-500 to-maroon-700 text-white shadow-sm'
              : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border border-saffron-100/20 dark:border-maroon-800/20 hover:bg-saffron-50/50 dark:hover:bg-maroon-900/10'
              }`}
          >
            {deity}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBhajans.map((track, idx) => {
          const isCurrent = currentTrackIndex !== null && bhajans[currentTrackIndex].id === track.id
          return (
            <div
              key={track.id}
              onClick={() => handleTrackSelect(idx)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${isCurrent
                ? 'bg-gradient-to-r from-saffron-500/10 to-maroon-600/5 border-saffron-300 dark:border-maroon-800 shadow-sm'
                : 'bg-white dark:bg-dev-card-dark border-saffron-100/30 dark:border-maroon-800/30 hover:border-saffron-200 dark:hover:border-maroon-800/60 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Status Indicator / Index */}
                <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-lg bg-saffron-50 dark:bg-maroon-950/20 border border-saffron-100/10">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4 w-4">
                      <span className="w-1 bg-saffron-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1 bg-saffron-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 bg-saffron-500 rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s' }} />
                    </div>
                  ) : isCurrent ? (
                    <Play className="h-4 w-4 text-saffron-500" />
                  ) : (
                    <Music className="h-4 w-4 text-slate-400 group-hover:text-saffron-500 transition-colors" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-saffron-600 dark:text-gold-400 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {track.singer} • <span className="text-[10px] uppercase font-bold text-saffron-600/70 dark:text-gold-400/70">{track.deity}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{track.duration}</span>
                <button className="p-1 rounded-full text-slate-300 hover:text-red-500 dark:text-slate-700 dark:hover:text-red-400 transition-colors">
                  <Heart className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Audio Player Bar */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-dev-bg-dark/95 border-t border-saffron-100/30 dark:border-maroon-800/30 shadow-xl backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Song details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-saffron-500 to-maroon-700 text-white shadow-md">
                  <Music className="h-6 w-6 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{currentTrack.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentTrack.singer}</p>
                </div>
              </div>

              {/* Player controls */}
              <div className="flex flex-col items-center flex-1 max-w-xl mx-4">
                <div className="flex items-center gap-6">
                  <button onClick={handlePrev} className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <SkipBack className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(prev => !prev)}
                    className="p-3 rounded-full bg-gradient-to-r from-saffron-500 to-maroon-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>
                  <button onClick={handleNext} className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer">
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-400">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800 accent-saffron-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-semibold text-slate-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume details */}
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => setIsMuted(prev => !prev)} className="p-1 text-slate-500 hover:text-saffron-500 dark:text-slate-400 dark:hover:text-gold-400">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value))
                    setIsMuted(false)
                  }}
                  className="w-20 h-1 rounded-full bg-slate-200 dark:bg-slate-800 accent-saffron-500 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
