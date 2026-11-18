import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  CalendarClock, Sunrise, Sunset, Moon, Sparkles,
  AlertTriangle, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react'

export function Panchang() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const adjustDate = (days: number) => {
    setSelectedDate(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  // Mock Panchang Data
  const panchangData = {
    samvat: 'Vikram Samvat 2083 (Krodhi)',
    shaka: 'Shaka Samvat 1948',
    ayan: 'Uttarayan (Northern Transit)',
    ritu: 'Grishma (Summer)',
    masa: 'Jyeshtha (Adhika)',
    paksha: 'Shukla Paksha',
    vara: 'Tuesday (Mangalvara)',
    tithi: 'Dwitiya (up to 03:45 PM, then Tritiya)',
    nakshatra: 'Rohini (up to 07:12 PM, then Mrigashira)',
    yoga: 'Sukarma (up to 08:30 PM)',
    karana: 'Balava (up to 03:45 PM, then Kaulava)',
    sun: { rise: '05:14 AM', set: '06:58 PM' },
    moon: { rise: '06:12 AM', set: '08:45 PM' }
  }

  const auspiciousTimings = [
    { name: 'Abhijit Muhurta', time: '11:40 AM - 12:35 PM', desc: 'Best for new undertakings' },
    { name: 'Vijay Muhurta', time: '02:25 PM - 03:20 PM', desc: 'Good for solving disputes' },
    { name: 'Amrit Kaal', time: '04:10 PM - 05:40 PM', desc: 'Highly auspicious period' }
  ]

  const inauspiciousTimings = [
    { name: 'Rahu Kaal', time: '03:30 PM - 05:10 PM', desc: 'Avoid important actions' },
    { name: 'Yamaganda Kaal', time: '08:30 AM - 10:10 AM', desc: 'Do not start travel' },
    { name: 'Gulika Kaal', time: '12:00 PM - 01:40 PM', desc: 'Auspicious/neutral delayed outcomes' }
  ]

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header / Date Selector */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-600 dark:text-gold-400">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Daily Panchang</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sacred Vedic Calendar and Muhurta Timings</p>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2 bg-saffron-50/50 dark:bg-maroon-900/30 p-1.5 rounded-full border border-saffron-100/20 dark:border-maroon-800/20">
          <button
            onClick={() => adjustDate(-1)}
            className="p-1.5 rounded-full hover:bg-white dark:hover:bg-dev-card-dark text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold px-4 text-slate-800 dark:text-slate-200">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={() => adjustDate(1)}
            className="p-1.5 rounded-full hover:bg-white dark:hover:bg-dev-card-dark text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Sun/Moon Timings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Sunrise</p>
            <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 mt-1">{panchangData.sun.rise}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl">
            <Sunrise className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Sunset</p>
            <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 mt-1">{panchangData.sun.set}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 dark:bg-orange-950/20 dark:text-orange-400 rounded-xl">
            <Sunset className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Moonrise</p>
            <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 mt-1">{panchangData.moon.rise}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl">
            <Moon className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Moonset</p>
            <p className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 mt-1">{panchangData.moon.set}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 dark:bg-purple-950/20 dark:text-purple-400 rounded-xl">
            <Moon className="h-6 w-6 rotate-180" />
          </div>
        </motion.div>
      </div>

      {/* Five Limbs of Panchang */}
      <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-gold-400 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-saffron-500" />
          Vedic Era & Five Elements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Era / Calendar info */}
          <div className="bg-saffron-50/30 dark:bg-maroon-950/10 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-gold-400">Vedic Calendar Eras</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Vikram Samvat:</span><span className="font-semibold">{panchangData.samvat}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Shaka Samvat:</span><span className="font-semibold">{panchangData.shaka}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Ayana:</span><span className="font-semibold">{panchangData.ayan}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Ritu (Season):</span><span className="font-semibold">{panchangData.ritu}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Masa (Month):</span><span className="font-semibold">{panchangData.masa}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Paksha (Fortnight):</span><span className="font-semibold">{panchangData.paksha}</span></div>
            </div>
          </div>

          {/* Core limbs */}
          <div className="bg-saffron-50/30 dark:bg-maroon-950/10 p-4 rounded-xl space-y-3 md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-gold-400">Five Limbs (Panchang)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white dark:bg-dev-bg-dark rounded-lg border border-saffron-100/10">
                <span className="text-slate-400 block mb-0.5">Vara (Day of Week)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{panchangData.vara}</span>
              </div>
              <div className="p-3 bg-white dark:bg-dev-bg-dark rounded-lg border border-saffron-100/10">
                <span className="text-slate-400 block mb-0.5">Tithi (Lunar Day)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{panchangData.tithi}</span>
              </div>
              <div className="p-3 bg-white dark:bg-dev-bg-dark rounded-lg border border-saffron-100/10">
                <span className="text-slate-400 block mb-0.5">Nakshatra (Constellation)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{panchangData.nakshatra}</span>
              </div>
              <div className="p-3 bg-white dark:bg-dev-bg-dark rounded-lg border border-saffron-100/10">
                <span className="text-slate-400 block mb-0.5">Yoga (Combination)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{panchangData.yoga}</span>
              </div>
              <div className="p-3 bg-white dark:bg-dev-bg-dark rounded-lg border border-saffron-100/10 sm:col-span-2">
                <span className="text-slate-400 block mb-0.5">Karana (Half of Tithi)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{panchangData.karana}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Muhurta section: Auspicious & Inauspicious */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Auspicious Timings */}
        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Auspicious Muhurtas (Shubh)
          </h2>
          <div className="space-y-4">
            {auspiciousTimings.map((time, idx) => (
              <div key={idx} className="flex justify-between items-start p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition-all">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{time.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{time.desc}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                  {time.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inauspicious Timings */}
        <motion.div variants={cardVariants} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
            Inauspicious Periods (Ashubh)
          </h2>
          <div className="space-y-4">
            {inauspiciousTimings.map((time, idx) => (
              <div key={idx} className="flex justify-between items-start p-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition-all">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{time.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{time.desc}</p>
                </div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-0.5 rounded-lg">
                  {time.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
