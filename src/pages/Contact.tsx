import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall, Mail, MapPin, Sparkles, Send, CheckCircle2 } from 'lucide-react'

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const contactInfo = [
    { title: 'Email Support', detail: 'support@devotionapp.com', icon: Mail, subtitle: 'Expect a response within 24 hours' },
    { title: 'Phone Support', detail: '+91 1800 123 4567', icon: PhoneCall, subtitle: 'Mon - Sat: 9 AM - 6 PM IST' },
    { title: 'Office Location', detail: 'Assi Ghat, Varanasi, UP, India', icon: MapPin, subtitle: 'Physical spiritual office' }
  ]

  const faqs = [
    { q: "How are the Daily Panchang timings calculated?", a: "We utilize NASA planetary positions and the Lahiri Ayanamsha (Chitra Paksha) algorithms to calculate precise Tithi and Nakshatra timings specifically aligned with Varanasi coordinates." },
    { q: "Are my temple donations tax-deductible?", a: "Yes, all donations toward Annadanam or school upkeep are routed through registered temple trusts and qualify for 50% tax deductions under Section 80G of the Income Tax Act." }
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 text-white shadow-md">
          <PhoneCall className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400">Contact & Support</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Reach out to our spiritual technical support or read through frequently asked questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left column: Contact Info & FAQ */}
        <div className="space-y-6">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon
            return (
              <div key={idx} className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-4 shadow-sm flex gap-4 items-center">
                <div className="p-3 bg-saffron-500/10 text-saffron-600 dark:text-gold-400 rounded-xl shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-slate-800 dark:text-slate-200">{info.title}</h3>
                  <p className="text-xs font-semibold text-saffron-600 dark:text-gold-400 mt-0.5">{info.detail}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{info.subtitle}</p>
                </div>
              </div>
            )
          })}

          <div className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-saffron-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Q: {faq.q}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h2 className="text-lg font-serif font-bold text-slate-800 dark:text-gold-400">
                  Send a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Your Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-xl border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
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
                      className="w-full h-10 px-3 rounded-xl border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 font-medium block mb-1">Subject</label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-xl border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500"
                  />
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 font-medium block mb-1">Message / Inquiry Details</label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-saffron-200/50 bg-white/50 text-sm dark:border-maroon-800/50 dark:bg-dev-card-dark/50 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-saffron-500 to-maroon-700 hover:from-saffron-600 hover:to-maroon-800 shadow-md hover:shadow-lg transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Send Inquiry
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-2xl p-8 shadow-md space-y-4"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-slate-200">Message Delivered</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Thank you, <strong>{formData.name}</strong>, for reaching out. We have logged your request and a support volunteer will email you at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="px-6 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-gold-400 border border-saffron-500/20 hover:bg-saffron-500/5 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
