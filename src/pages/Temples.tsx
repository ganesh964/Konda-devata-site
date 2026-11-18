import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Search, MapPin, Filter } from 'lucide-react'

interface TempleItem {
  id: number
  name: string
  deity: string
  location: string
  era: string
  architecturalStyle: string
  description: string
  region: 'North' | 'South' | 'East' | 'West'
}

export function Temples() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const temples: TempleItem[] = [
    {
      id: 1,
      name: "Kashi Vishwanath Mandir",
      deity: "Lord Shiva",
      location: "Varanasi, Uttar Pradesh",
      era: "Reconstructed in 1780 AD by Ahilyabai Holkar",
      architecturalStyle: "North Indian (Nagara)",
      description: "One of the most famous Hindu temples, dedicated to Lord Shiva. It stands on the western bank of the holy river Ganga and is one of the twelve Jyotirlingas.",
      region: "North"
    },
    {
      id: 2,
      name: "Brihadisvara Mandir",
      deity: "Lord Shiva",
      location: "Thanjavur, Tamil Nadu",
      era: "Completed in 1010 AD by Raja Raja Chola I",
      architecturalStyle: "Dravidian Architecture",
      description: "A UNESCO World Heritage Site, famous for its massive Vimana tower and monolithic Nandi statue. It is one of the largest temples in South India.",
      region: "South"
    },
    {
      id: 3,
      name: "Jagannath Mandir",
      deity: "Lord Jagannath (Vishnu)",
      location: "Puri, Odisha",
      era: "Built in 12th Century AD by Anantavarman Chodaganga",
      architecturalStyle: "Kalinga Architecture",
      description: "Famous for its annual Ratha Yatra (Chariot Festival). The temple is sacred to the Char Dham pilgrimage sect of Hinduism.",
      region: "East"
    },
    {
      id: 4,
      name: "Somnath Mandir",
      deity: "Lord Shiva",
      location: "Prabhas Patan, Gujarat",
      era: "Reconstructed in 1951 AD",
      architecturalStyle: "Chalukya (Kailash Mahameru Prasad)",
      description: "The first among the twelve Jyotirlinga shrines of Shiva. A symbol of resilience, it has been destroyed and rebuilt multiple times in history.",
      region: "West"
    },
    {
      id: 5,
      name: "Meenakshi Amman Mandir",
      deity: "Goddess Meenakshi (Parvati)",
      location: "Madurai, Tamil Nadu",
      era: "Rebuilt in 14th Century AD",
      architecturalStyle: "Dravidian Architecture",
      description: "Famous for its 14 towering gopurams covered in thousands of colorful stone figures. It forms the theological and cultural heart of Madurai.",
      region: "South"
    },
    {
      id: 6,
      name: "Kedarnath Mandir",
      deity: "Lord Shiva",
      location: "Kedarnath, Uttarakhand",
      era: "Ancient, revived by Adi Shankaracharya in 8th Century",
      architecturalStyle: "Himalayan Stone Architecture",
      description: "Nestled in the Garhwal Himalayan range, this holy temple is part of the Chhota Char Dham and the highest of the 12 Jyotirlingas.",
      region: "North"
    }
  ]

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temple.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || temple.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-saffron-600 text-white shadow-md">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Temples Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Discover the history, architecture, and spiritual significance of India's ancient temples</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saffron-100/20 dark:border-maroon-800/20 pb-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by temple, deity, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-saffron-200/50 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 dark:focus:ring-gold-500 transition-all duration-300"
          />
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" />
            Region:
          </span>
          {['All', 'North', 'South', 'East', 'West'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${selectedRegion === region
                ? 'bg-saffron-500/10 text-saffron-600 dark:text-gold-400 border border-saffron-500/30'
                : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border border-saffron-100/20 dark:border-maroon-800/20 hover:bg-saffron-50/50 dark:hover:bg-maroon-900/10'
                }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTemples.map((temple) => (
            <motion.div
              layout
              key={temple.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group overflow-hidden rounded-2xl border border-saffron-100/30 dark:border-maroon-800/30 bg-white dark:bg-dev-card-dark shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Header section with gradient background */}
              <div className="p-6 bg-gradient-to-br from-saffron-500/5 to-maroon-600/5 dark:from-maroon-950/20 dark:to-maroon-900/10 border-b border-saffron-100/10">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200 group-hover:text-saffron-600 dark:group-hover:text-gold-400 transition-colors">
                      {temple.name}
                    </h2>
                    <p className="text-xs text-saffron-600 dark:text-gold-400 font-bold mt-1 uppercase tracking-wide">
                      Deity: {temple.deity}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/60 dark:text-slate-500 px-2 py-0.5 rounded-md uppercase shrink-0">
                    {temple.region}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{temple.location}</span>
                </div>
              </div>

              {/* Body Section */}
              <div className="p-6 flex-1 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {temple.description}
                </p>

                <div className="space-y-1.5 border-t border-saffron-100/10 pt-4 text-[11px] text-slate-400 font-medium">
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Era: </span>
                    <span className="text-slate-600 dark:text-slate-300">{temple.era}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Style: </span>
                    <span className="text-slate-600 dark:text-slate-300">{temple.architecturalStyle}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
