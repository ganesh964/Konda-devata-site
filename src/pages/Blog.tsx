import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Clock, User, ArrowRight, X, Filter } from 'lucide-react'

interface Article {
  id: number
  title: string
  category: 'Philosophy' | 'Mythology' | 'Sadhana' | 'Temple History'
  author: string
  date: string
  readTime: string
  summary: string
  content: string
}

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)

  const categories = ['All', 'Philosophy', 'Mythology', 'Sadhana', 'Temple History']

  const articles: Article[] = [
    {
      id: 1,
      title: "Understanding Karma: The Cosmic Law of Cause and Effect",
      category: "Philosophy",
      author: "Swami Dhyanananda",
      date: "May 12, 2026",
      readTime: "6 min read",
      summary: "Explore the deep spiritual meaning of Karma as described in the Upanishads and Bhagavad Gita, and how it shapes our destiny.",
      content: "Karma is often misunderstood in modern culture as simple retributive justice or fate. However, in Vedic philosophy, Karma is the ultimate cosmic ledger of cause and effect. Every thought, word, and action generates a specific energy frequency that returns to the source.\n\nThere are three distinct types of Karma:\n1. Sanchita Karma: The accumulated storehouse of all past actions from previous lifetimes.\n2. Prarabdha Karma: The portion of Sanchita Karma currently manifesting in this lifetime (which we experience as our circumstances).\n3. Agami Karma: The fresh Karma we create through our current choices and actions.\n\nBy practicing Nishkama Karma (selfless action without attachment to results), as taught by Lord Krishna to Arjuna, we can gradually dissolve the binding nature of karma and attain inner peace and liberation (Moksha)."
    },
    {
      id: 2,
      title: "The Sacred Symbolism Behind Lord Shiva's Attributes",
      category: "Mythology",
      author: "Dr. Ananya Mishra",
      date: "May 08, 2026",
      readTime: "8 min read",
      summary: "From the crescent moon to the Trishula, decode the metaphysical representation of Mahadev's sacred weapons and symbols.",
      content: "Lord Shiva, the destroyer in the Hindu Trinity, is adorned with symbols that convey deep spiritual and scientific principles.\n\n- The Crescent Moon: Represents the cyclical nature of time and control over the mind's phases.\n- The Third Eye: Represents spiritual wisdom, intuition, and the destruction of ignorance (Avidya).\n- The Trishula (Trident): Signifies control over the three states of consciousness (Waking, Dreaming, Deep Sleep) and the three Gunas (Sattva, Rajas, Tamas).\n- The Snakes (Vasuki): Wrapping around His neck represents mastery over desires, fears, and poison.\n\nContemplating these symbols allows seekers to connect with the underlying non-dual truth that Shiva represents."
    },
    {
      id: 3,
      title: "Establishing a Daily Sadhana: A Beginner's Guide",
      category: "Sadhana",
      author: "Acharya Ram Gopal",
      date: "May 01, 2026",
      readTime: "5 min read",
      summary: "A practical guide to structuring a morning routine of meditation, chanting, and pranayama to foster daily mental clarity.",
      content: "Sadhana is the daily spiritual discipline that trains the mind, body, and senses. Setting up a consistent Sadhana is crucial for mental resilience.\n\nKey components of a standard morning Sadhana include:\n1. Brahma Muhurta Waking: Waking up between 4:00 AM and 5:30 AM when the atmospheric energy is quietest.\n2. Purification: A quick bath to refresh the physical senses.\n3. Pranayama: 10 minutes of Nadi Shodhana (alternate nostril breathing) to balance nervous energy.\n4. Chanting/Japa: 108 repetitions of a chosen mantra (such as Om Namah Shivaya) using a Japa mala.\n5. Meditation: Sitting silently in contemplation of the breath or the heart center.\n\nConsistency is far more important than intensity. Starting with just 15 minutes daily can build a foundation of lifelong spiritual evolution."
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-maroon-700 to-saffron-500 text-white shadow-md">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Articles & Wisdom</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Deepen your spiritual knowledge with research-backed articles and philosophy</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-saffron-100/20 dark:border-maroon-800/20 pb-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-saffron-200/50 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 dark:focus:ring-gold-500 transition-all duration-300"
          />
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${selectedCategory === cat
                ? 'bg-saffron-500/10 text-saffron-600 dark:text-gold-400 border border-saffron-500/30'
                : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border border-saffron-100/20 dark:border-maroon-800/20 hover:bg-saffron-50/50 dark:hover:bg-maroon-900/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="rounded-2xl border border-saffron-100/30 dark:border-maroon-800/30 bg-white dark:bg-dev-card-dark p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <span className="inline-block text-[9px] font-bold text-saffron-600 dark:text-gold-400 uppercase tracking-wider bg-saffron-500/10 dark:bg-gold-500/10 px-2.5 py-0.5 rounded-md">
                {article.category}
              </span>
              <h2 className="text-base font-serif font-bold text-slate-800 dark:text-slate-200 group-hover:text-saffron-600 dark:group-hover:text-gold-400 transition-colors leading-snug">
                {article.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="border-t border-saffron-100/10 pt-4 mt-6 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{article.author}</span>
              </div>
              <button
                onClick={() => setActiveArticle(article)}
                className="text-saffron-600 dark:text-gold-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Read More
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Drawer Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 scrollbar-thin space-y-6"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="inline-block text-[9px] font-bold text-saffron-600 dark:text-gold-400 uppercase tracking-wider bg-saffron-500/10 dark:bg-gold-500/10 px-2 py-0.5 rounded-md">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 dark:text-slate-200">
                    {activeArticle.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-maroon-900/40 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-y border-saffron-100/10 py-3">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="h-4 w-4" />
                  <span>By {activeArticle.author}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>{activeArticle.readTime}</span>
                </div>
                <div>{activeArticle.date}</div>
              </div>

              {/* Content Body */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              {/* Modal Footer quote decoration */}
              <div className="rounded-xl bg-saffron-500/5 dark:bg-maroon-950/20 border border-saffron-500/10 p-4 text-center">
                <p className="text-xs italic text-slate-500 dark:text-slate-400">
                  "Knowledge is the destroyer of delusion. Seek the light of wisdom daily."
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-serif">— Vedic Aphorism</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
