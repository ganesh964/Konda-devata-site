import { useState } from 'react'
import { Tv, Sparkles, AlertCircle } from 'lucide-react'

interface StreamInfo {
  id: number
  templeName: string
  location: string
  embedUrl: string // Youtube embed URL
  description: string
}

export function Darshan() {
  const streams: StreamInfo[] = [
    {
      id: 1,
      templeName: "Kashi Vishwanath, Varanasi",
      location: "Uttar Pradesh",
      embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCk10uN-Yf_h3s0XyF1w08pw", // Mock channel placeholder
      description: "Watch live prayers, aarti, and rituals directly from the sacred city of Varanasi."
    },
    {
      id: 2,
      templeName: "ISKCON Temple, Vrindavan",
      location: "Uttar Pradesh",
      embedUrl: "https://www.youtube.com/embed/live_stream?channel=UC4g19gN_Zl1e-G6n6YVzEsw",
      description: "Daily darshan and dynamic chanting from Sri Krishna Balaram Mandir in holy Vrindavan."
    },
    {
      id: 3,
      templeName: "Siddhivinayak Temple, Mumbai",
      location: "Maharashtra",
      embedUrl: "https://www.youtube.com/embed/live_stream?channel=UC2n6PZ53ZgXpT5Q4a7p4l3w",
      description: "Live darshan of Lord Ganesha from the heart of Mumbai, featuring aartis and special poojas."
    }
  ]

  const [activeStream, setActiveStream] = useState<StreamInfo>(streams[0])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-amber-500 text-white shadow-md">
          <Tv className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Live Darshan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Experience virtual real-time streaming from prominent temples across India</p>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Stream Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-saffron-100/30 dark:border-maroon-800/30 bg-black shadow-lg">
            <iframe
              src={activeStream.embedUrl}
              title={activeStream.templeName}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="bg-white dark:bg-dev-card-dark rounded-2xl p-5 border border-saffron-100/30 dark:border-maroon-800/30">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">
                {activeStream.templeName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{activeStream.location}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              {activeStream.description}
            </p>
          </div>
        </div>

        {/* Stream Selector */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-saffron-500" />
            Available Streams
          </h2>

          <div className="space-y-3">
            {streams.map((stream) => {
              const isActive = activeStream.id === stream.id
              return (
                <div
                  key={stream.id}
                  onClick={() => setActiveStream(stream)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${isActive
                    ? 'bg-gradient-to-r from-saffron-500/10 to-maroon-600/5 border-saffron-400 dark:border-maroon-800'
                    : 'bg-white dark:bg-dev-card-dark border-saffron-100/30 dark:border-maroon-800/30 hover:border-saffron-200 dark:hover:border-maroon-800/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${isActive ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {stream.templeName}
                    </h3>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stream.location}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {stream.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="rounded-xl bg-saffron-500/10 dark:bg-maroon-950/20 border border-saffron-500/10 p-4 flex gap-3 text-xs text-slate-600 dark:text-slate-400">
            <AlertCircle className="h-5 w-5 text-saffron-600 dark:text-gold-400 shrink-0" />
            <p className="leading-normal">
              Stream quality and availability are dependent on temple network systems. Click the refresh icon to restart the feed if it lags.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
