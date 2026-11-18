import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Quote, Copy, Check, Share2, Sparkles, BookOpen } from 'lucide-react'

interface QuoteItem {
  id: number
  text: string
  source: string
  category: string
  translation?: string
}

export function Quotes() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const categories = ['All', 'Bhagavad Gita', 'Upanishads', 'Ramayana', 'Vivekananda', 'Kabir']

  const quotes: QuoteItem[] = [
    {
      id: 1,
      text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      source: "Bhagavad Gita 2.47",
      category: "Bhagavad Gita",
      translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
    },
    {
      id: 2,
      text: "Arise, awake, and stop not till the goal is reached.",
      source: "Swami Vivekananda",
      category: "Vivekananda"
    },
    {
      id: 3,
      text: "यतो धर्मस्ततो जयः।",
      source: "Sanskrit Shloka (Mahabharata)",
      category: "Ramayana",
      translation: "Where there is Dharma, there is victory."
    },
    {
      id: 4,
      text: "कल करे सो आज कर, आज करे सो अब। पल में प्रलय होएगी, बहुरि करेगा कब॥",
      source: "Kabir Ke Dohe",
      category: "Kabir",
      translation: "Do tomorrow's work today, and today's work now. If the moment is lost in a flash, when will you finish?"
    },
    {
      id: 5,
      text: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्। तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
      source: "Isha Upanishad 1",
      category: "Upanishads",
      translation: "Everything animate or inanimate that is within the universe is controlled and owned by the Lord. One should therefore accept only those things necessary for oneself."
    },
    {
      id: 6,
      text: "The mind is everything. What you think you become.",
      source: "Upanishadic Wisdom",
      category: "Upanishads"
    },
    {
      id: 7,
      text: "सत्यमेव जयते नानृतं",
      source: "Mundaka Upanishad",
      category: "Upanishads",
      translation: "Truth alone triumphs, not untruth."
    },
    {
      id: 8,
      text: "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.",
      source: "Brihadaranyaka Upanishad",
      category: "Upanishads"
    }
  ]

  const filteredQuotes = selectedCategory === 'All'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory)

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } }
  }

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-gold-500 text-white shadow-md">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Daily Quotes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Timeless spiritual wisdom from ancient Indian scriptures and saints</p>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div variants={cardVariants} className="flex flex-wrap gap-2 border-b border-saffron-100/20 dark:border-maroon-800/20 pb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${selectedCategory === cat
              ? 'bg-gradient-to-r from-saffron-500 to-maroon-700 text-white shadow-sm'
              : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border border-saffron-100/20 dark:border-maroon-800/20 hover:bg-saffron-50/50 dark:hover:bg-maroon-900/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Quotes Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((quote) => (
            <motion.div
              layout
              key={quote.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative overflow-hidden rounded-2xl border border-saffron-100/30 dark:border-maroon-800/30 bg-white dark:bg-dev-card-dark p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <Quote className="absolute right-6 top-6 h-12 w-12 text-saffron-200/20 dark:text-maroon-800/10 pointer-events-none group-hover:scale-110 transition-transform duration-300" />

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-saffron-600 dark:text-gold-400 bg-saffron-500/10 dark:bg-gold-500/10 px-2 py-0.5 rounded-md">
                    <Sparkles className="h-2.5 w-2.5" />
                    {quote.category}
                  </span>
                </div>

                <p className="font-serif text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  "{quote.text}"
                </p>

                {quote.translation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-saffron-300 dark:border-maroon-800 pl-3">
                    {quote.translation}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-saffron-100/30 dark:border-maroon-800/30 pt-4 mt-6 text-xs">
                <span className="font-serif font-semibold text-slate-500 dark:text-slate-400">
                  — {quote.source}
                </span>

                <div className="flex items-center gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(quote.translation ? `${quote.text}\n\nTranslation: ${quote.translation}\n— ${quote.source}` : `${quote.text}\n— ${quote.source}`, quote.id)}
                    className="p-1.5 rounded-lg border border-saffron-100/20 dark:border-maroon-800/20 text-slate-400 hover:text-saffron-600 dark:hover:text-gold-400 hover:bg-saffron-50 dark:hover:bg-maroon-900/40 transition-all cursor-pointer"
                    title="Copy Quote"
                  >
                    {copiedId === quote.id ? <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in" /> : <Copy className="h-4 w-4" />}
                  </button>
                  {/* Share Button (Mock) */}
                  <button
                    className="p-1.5 rounded-lg border border-saffron-100/20 dark:border-maroon-800/20 text-slate-400 hover:text-saffron-600 dark:hover:text-gold-400 hover:bg-saffron-50 dark:hover:bg-maroon-900/40 transition-all cursor-pointer"
                    title="Share Quote"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
