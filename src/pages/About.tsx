import { motion, type Variants } from 'framer-motion'
import { Info, Sparkles, Heart, Shield, Award } from 'lucide-react'

export function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  const pillars = [
    { title: 'Preserving Sacred Heritage', desc: 'Documenting and celebrating the history, architectural design, and lore of traditional temple systems.', icon: Shield, color: 'text-saffron-600 dark:text-gold-400' },
    { title: 'Authentic Vedic Timings', desc: 'Calculating precise Panchang, auspicious muhurtas, and fast calendars derived from traditional astronomical metrics.', icon: Award, color: 'text-gold-500' },
    { title: 'Community Annadanam', desc: 'Channeling devotional donations directly into authentic temple kitchens feeding pilgrims and families.', icon: Heart, color: 'text-red-500' }
  ]

  return (
    <motion.div
      className="space-y-12 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-600 dark:text-gold-400">
          <Info className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">About Our Mission</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Blending ancient spiritual traditions with state-of-the-art technology</p>
        </div>
      </motion.div>

      {/* Story section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={cardVariants} className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200">Our Story & Purpose</h2>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
            <p>
              In today's fast-paced digital world, staying connected to our spiritual roots can often feel challenging. Rituals, calendars, and sacred chants can feel distant amid the noise of modern life.
            </p>
            <p>
              <strong>Devotion</strong> was born from a desire to bridge this gap. Inspired by the calm and majestic aesthetics of traditional Indian temples, we built a digital sanctuary that respects sacred parameters while leveraging modern user experiences.
            </p>
            <p>
              Whether you are checking the daily Abhijit Muhurta, listening to a meditative rendition of the Shiva Tandav Stotram, exploring the history of the Chola-era temples, or sponsoring Annadanam for pilgrims, our app offers a highly structured, premium gateway to peace.
            </p>
          </div>
        </motion.div>

        {/* Info card side */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-saffron-500 to-maroon-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between min-h-[220px]">
          <div className="space-y-4">
            <Sparkles className="h-8 w-8 text-gold-300" />
            <h3 className="font-serif text-lg font-bold">Divine Wisdom</h3>
            <p className="text-xs leading-relaxed text-slate-100">
              "When a person beholds the Unity of all things, how can there be room for grief or delusion?"
            </p>
          </div>
          <p className="text-[10px] text-gold-300 font-serif border-t border-white/20 pt-2 mt-4">— Isha Upanishad</p>
        </motion.div>
      </div>

      {/* Core pillars */}
      <motion.div variants={cardVariants} className="space-y-6">
        <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200 text-center">Core Pillars of Devotion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div key={idx} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm space-y-4 text-center">
                <div className="flex justify-center">
                  <div className={`p-3 bg-saffron-500/5 dark:bg-maroon-900/20 rounded-xl ${pillar.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">{pillar.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
