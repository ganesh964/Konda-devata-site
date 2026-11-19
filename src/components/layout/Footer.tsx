import { Link } from 'react-router-dom'
import { Flame, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[var(--color-gold-500)] to-[var(--color-saffron-500)] dark:from-[var(--color-saffron-800)] dark:to-[var(--color-maroon-800)] border-t border-saffron-100/30 dark:border-maroon-800/30 text-slate-600 dark:text-slate-400 py-12 px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 to-maroon-700 shrink-0">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-sans text-base sm:text-lg font-bold tracking-wide text-maroon-800 dark:text-gold-400 leading-relaxed">
              కొండ దేవత అమ్మవారి దేవాలయం
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
            విశాఖపట్నంలోని ప్రసిద్ధ కొండ దేవత అమ్మవారి దేవాలయం యొక్క అధికారిక పోర్టల్. ఆలయ చరిత్ర, దినసరి పంచాంగం, శుభ ముహూర్తాలు, భజనల వివరాలను కనుగొనండి.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-800 dark:text-gold-400 tracking-wider uppercase mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/panchang" className="hover:text-saffron-500 dark:hover:text-gold-300 transition-colors">
                Daily Panchang
              </Link>
            </li>
            <li>
              <Link to="/bhajans" className="hover:text-saffron-500 dark:hover:text-gold-300 transition-colors">
                Bhajans & Songs
              </Link>
            </li>
            <li>
              <Link to="/temples" className="hover:text-saffron-500 dark:hover:text-gold-300 transition-colors">
                Temples Directory
              </Link>
            </li>
            <li>
              <Link to="/festivals" className="hover:text-saffron-500 dark:hover:text-gold-300 transition-colors">
                Festivals Calendar
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-800 dark:text-gold-400 tracking-wider uppercase mb-4">
            ఆలయ సంప్రదింపులు
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-saffron-700 shrink-0 mt-0.5" />
              <span>సింహగిరి కాలనీ, సాలగ్రామపురం, విశాఖపట్నం, ఆంధ్రప్రదేశ్ 530024</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-saffron-700 shrink-0" />
              <span>support@kondadevata.org</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-saffron-700 shrink-0" />
              <span>+91 9553250533</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-saffron-100/30 dark:border-maroon-800/30 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-slate-500 dark:text-slate-500">
        <p>© {new Date().getFullYear()} కొండ దేవత అమ్మవారి దేవాలయం. All rights reserved.</p>
      </div>
    </footer>
  )
}
