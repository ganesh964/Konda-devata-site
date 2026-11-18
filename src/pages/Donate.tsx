import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

// Generate a random transaction ID outside the component (module scope, not during render)
function generateTxnId() {
  return String(Date.now()).slice(-8)
}

export function Donate() {
  const [amount, setAmount] = useState('1100')
  const [customAmount, setCustomAmount] = useState('')
  const [cause, setCause] = useState('Feed the Needy')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', pan: '' })

  // Stable transaction ID stored in a ref — never changes on re-render
  const transactionIdRef = useRef(generateTxnId())

  const quickAmounts = ['501', '1100', '2100', '5100']
  const causes = [
    { name: 'Feed the Needy (Annadanam)', desc: 'Provides free daily nutritious meals to pilgrims and underprivileged children.' },
    { name: 'Temple Renovation & Maintenance', desc: 'Preserves the structural and aesthetic heritage of ancient local shrines.' },
    { name: 'Sanskrit Pathshala Support', desc: 'Sponsors the education, housing, and food for young Vedic pupils.' },
    { name: 'Ganga Aarti Upkeep', desc: 'Supports daily pooja samagri and structural arrangements for the grand river aartis.' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const selectedAmount = amount === 'custom' ? customAmount : amount

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-maroon-700 text-white shadow-md">
          <Heart className="h-6 w-6 fill-white" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Devotional Donations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Support sacred temple preservation, Vedic education, and community kitchens (Annadanam)</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="donation-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Left side: Causes and Amount */}
            <div className="md:col-span-2 space-y-6">

              {/* Select Cause */}
              <div className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-saffron-500" />
                  1. Choose a Spiritual Cause
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {causes.map((c) => {
                    const isSelected = cause === c.name
                    return (
                      <div
                        key={c.name}
                        onClick={() => setCause(c.name)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-xs ${isSelected
                          ? 'bg-saffron-500/10 border-saffron-400 dark:border-maroon-800'
                          : 'bg-white dark:bg-dev-card-dark border-saffron-100/30 dark:border-maroon-800/30 hover:border-saffron-200'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-semibold text-sm ${isSelected ? 'text-saffron-600 dark:text-gold-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {c.name}
                          </span>
                          {isSelected && <span className="h-2 w-2 rounded-full bg-saffron-500" />}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                          {c.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Select Amount */}
              <div className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-1.5">
                  <Heart className="h-4.5 w-4.5 text-saffron-500" />
                  2. Select Contribution Amount (INR)
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickAmounts.map((amt) => {
                    const isSelected = amount === amt
                    return (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setAmount(amt)
                          setCustomAmount('')
                        }}
                        className={`py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${isSelected
                          ? 'bg-gradient-to-r from-saffron-500 to-maroon-700 text-white border-transparent shadow-sm'
                          : 'bg-white dark:bg-dev-card-dark text-slate-600 dark:text-slate-400 border-saffron-100/30 dark:border-maroon-800/30 hover:border-saffron-200'
                          }`}
                      >
                        ₹{amt}
                      </button>
                    )
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-400 font-medium block mb-1">Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-sm font-semibold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="Enter other amount"
                      value={customAmount}
                      onChange={(e) => {
                        setAmount('custom')
                        setCustomAmount(e.target.value)
                      }}
                      className="w-full h-10 pl-8 pr-4 rounded-xl border border-saffron-200/50 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 dark:focus:ring-gold-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right side: Donor Info Form */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400">
                  3. Donor Details
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 rounded-lg border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 rounded-lg border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 rounded-lg border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-medium block mb-1">PAN Card Number (for 80G Tax Exemption)</label>
                    <input
                      type="text"
                      name="pan"
                      placeholder="Optional"
                      value={formData.pan}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 rounded-lg border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500 uppercase"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-saffron-100/10 space-y-3">
                  <div className="flex gap-2 text-[10px] text-slate-400 items-start">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Your transactions are secured with 256-bit encryption. Receipts will be sent instantly.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-saffron-500 to-maroon-700 hover:from-saffron-600 hover:to-maroon-800 shadow-md hover:shadow-lg transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                  >
                    Donate ₹{selectedAmount || '0'}
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="donation-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-8 shadow-md space-y-6"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200">Contribution Confirmed!</h2>
              <p className="text-xs text-slate-400">Thank you, {formData.name}, for your generous support of ₹{selectedAmount}.</p>
            </div>

            <div className="bg-saffron-500/5 dark:bg-maroon-950/20 border border-saffron-500/10 rounded-xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between"><span className="text-slate-400">Transaction ID:</span><span className="font-semibold font-mono">TXN{transactionIdRef.current}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cause Support:</span><span className="font-semibold text-saffron-600 dark:text-gold-400">{cause}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span><span className="font-semibold">{formData.email}</span></div>
              {formData.pan && (
                <div className="flex justify-between"><span className="text-slate-400">Tax Exemption:</span><span className="font-semibold uppercase">PAN {formData.pan} Verified</span></div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              "Giving is the highest form of worship, where we share our fortunes with society."
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ name: '', email: '', phone: '', pan: '' })
                setCustomAmount('')
                setAmount('1100')
              }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-gold-400 border border-saffron-500/20 hover:bg-saffron-500/5 transition-colors cursor-pointer"
            >
              Support another cause
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
