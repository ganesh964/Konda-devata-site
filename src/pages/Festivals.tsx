import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Sparkles, Clock, Info, Check, Filter } from 'lucide-react'

interface FestivalItem {
  id: number
  name: string
  date: string
  month: 'May' | 'June' | 'July' | 'August'
  significance: string
  rituals: string[]
  muhurta: string
  tithi: string
}

export function Festivals() {
  const [selectedMonth, setSelectedMonth] = useState<'All' | 'May' | 'June' | 'July' | 'August'>('All')
  const [expandedFestivalId, setExpandedFestivalId] = useState<number | null>(null)

  const festivals: FestivalItem[] = [
    {
      id: 1,
      name: "Buddha Purnima",
      date: "May 20, 2026",
      month: "May",
      significance: "Commemorates the birth, enlightenment (Nirvana), and death (Parinirvana) of Gautama Buddha.",
      rituals: [
        "Visiting temples and paying respects to Lord Buddha",
        "Offering flowers, candles, and incense",
        "Engaging in meditation and observing vegetarian diets",
        "Donating food and clothing to the needy"
      ],
      muhurta: "Purnima Tithi Begins: May 19, 09:30 PM | Ends: May 20, 11:15 PM",
      tithi: "Jyeshtha Purnima"
    },
    {
      id: 2,
      name: "Nirjala Ekadashi",
      date: "May 27, 2026",
      month: "May",
      significance: "The most sacred and toughest Ekadashi fast, observed without drinking water. It brings benefits equal to visiting all holy pilgrimages.",
      rituals: [
        "Observing complete waterless and foodless fast (24 hours)",
        "Worshipping Lord Vishnu with yellow flowers and incense",
        "Reciting Vishnu Sahasranama",
        "Donating water pots, umbrellas, and food on Dwadashi"
      ],
      muhurta: "Parana Time: May 28, 05:25 AM - 08:15 AM",
      tithi: "Jyeshtha Shukla Ekadashi"
    },
    {
      id: 3,
      name: "Ganga Dussehra",
      date: "June 04, 2026",
      month: "June",
      significance: "Celebrates the descent of the holy river Ganga from Heaven to Earth through Lord Shiva's locks, resolving ancestral sins.",
      rituals: [
        "Taking a holy dip in River Ganga or adding Ganga jal to bath water",
        "Offering Arghya to the Sun God while standing in water",
        "Performing Ganga Aarti and floating clay lamps",
        "Performing charity (Dan) of 10 specific items"
      ],
      muhurta: "Dashami Tithi Begins: June 03, 01:25 PM | Ends: June 04, 03:10 PM",
      tithi: "Jyeshtha Shukla Dashami"
    },
    {
      id: 4,
      name: "Jagannath Rath Yatra",
      date: "June 16, 2026",
      month: "June",
      significance: "Grand chariot procession of Lord Jagannath, Balabhadra, and Subhadra to Gundicha Temple.",
      rituals: [
        "Pulling the holy chariots (Rathas) for spiritual liberation",
        "Singing devotional bhajans and kirtans in processions",
        "Eating holy Mahaprasad offered to Lord Jagannath",
        "Worshipping the deities during their Gundicha stay"
      ],
      muhurta: "Yatra Begins: June 16, 09:00 AM onwards",
      tithi: "Ashadha Shukla Dwitiya"
    },
    {
      id: 5,
      name: "Guru Purnima",
      date: "July 29, 2026",
      month: "July",
      significance: "Dedicated to expressing gratitude towards spiritual and academic gurus/teachers. Also marks the birthday of Sage Veda Vyasa.",
      rituals: [
        "Performing Puja or Aarti for spiritual gurus",
        "Visiting ashrams and listing to spiritual discourses",
        "Initiating spiritual learning or mantras",
        "Distributing food or Prasad (Guru Puja Bhandara)"
      ],
      muhurta: "Purnima Tithi Begins: July 28, 03:40 AM | Ends: July 29, 05:55 AM",
      tithi: "Ashadha Purnima"
    }
  ]

  const filteredFestivals = selectedMonth === 'All'
    ? festivals
    : festivals.filter(f => f.month === selectedMonth)

  const toggleExpand = (id: number) => {
    setExpandedFestivalId(expandedFestivalId === id ? null : id)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-maroon-600 text-white shadow-md">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Festivals Calendar</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track sacred upcoming festivals, fasts, pooja muhurtas, and rituals</p>
        </div>
      </div>

      {/* Monthly filters */}
      <div className="flex flex-wrap gap-2 border-b border-saffron-100/20 dark:border-maroon-800/20 pb-4 items-center">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <Filter className="h-3.5 w-3.5" />
          Filter Month:
        </span>
        {(['All', 'May', 'June', 'July', 'August'] as const).map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${selectedMonth === month
              ? 'bg-saffron-500/10 text-saffron-600 dark:text-gold-400 border border-saffron-500/30'
              : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border border-saffron-100/20 dark:border-maroon-800/20 hover:bg-saffron-50/50 dark:hover:bg-maroon-900/10'
              }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Festivals List */}
      <div className="space-y-4">
        {filteredFestivals.map((fest) => {
          const isExpanded = expandedFestivalId === fest.id
          return (
            <motion.div
              layout
              key={fest.id}
              className={`rounded-2xl border transition-all ${isExpanded
                ? 'bg-gradient-to-br from-saffron-500/5 to-maroon-600/5 border-saffron-300 dark:border-maroon-800 shadow-sm'
                : 'bg-white dark:bg-dev-card-dark border-saffron-100/30 dark:border-maroon-800/30 hover:border-saffron-200 dark:hover:border-maroon-800/60 shadow-sm'
                }`}
            >
              {/* Card Summary click to expand */}
              <div
                onClick={() => toggleExpand(fest.id)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-saffron-500/10 text-saffron-600 dark:text-gold-400 font-bold text-xs uppercase text-center flex-col">
                    <span className="text-[10px] leading-tight">{fest.date.split(' ')[0]}</span>
                    <span className="text-sm font-semibold tracking-tighter leading-none">{fest.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h3 className={`text-base font-serif font-bold ${isExpanded ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {fest.name}
                    </h3>
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-0.5">
                      {fest.tithi}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Click to view details
                  </span>
                  <Info className={`h-4.5 w-4.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-saffron-600 dark:text-gold-400' : ''}`} />
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-saffron-100/20 dark:border-maroon-800/20"
                  >
                    <div className="p-6 space-y-6 text-xs text-slate-600 dark:text-slate-300">
                      {/* Significance */}
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-saffron-500 animate-pulse" />
                          Spiritual Significance
                        </h4>
                        <p className="leading-relaxed">{fest.significance}</p>
                      </div>

                      {/* Pooja Muhurtas */}
                      <div className="p-3.5 bg-saffron-500/5 dark:bg-maroon-900/10 border border-saffron-500/10 rounded-xl space-y-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-saffron-500" />
                          Auspicious Pooja Muhurta
                        </h4>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{fest.muhurta}</p>
                      </div>

                      {/* Rituals list */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-saffron-500" />
                          Key Rituals & Obserances
                        </h4>
                        <ul className="space-y-2 pl-1">
                          {fest.rituals.map((ritual, idx) => (
                            <li key={idx} className="flex gap-2 items-start">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-saffron-100 dark:bg-maroon-900/40 text-[10px] text-saffron-600 dark:text-gold-400 font-bold">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{ritual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
