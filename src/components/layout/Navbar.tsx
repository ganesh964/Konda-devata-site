import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-br from-[var(--color-gold-500)] to-[var(--color-saffron-500)] dark:from-[var(--color-saffron-800)] dark:to-[var(--color-maroon-800)] backdrop-blur-md transition-all duration-300 border-b border-saffron-100/30 dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group py-1 relative z-50">
            <img
              src="/logo.png"
              alt="కొండ దేవత అమ్మవారి"
              className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-gold-400 ring-offset-2 ring-offset-white dark:ring-offset-[#161617] shrink-0"
            />
            <span className="font-sans text-sm sm:text-base lg:text-lg font-bold tracking-wide transition-colors whitespace-nowrap leading-relaxed text-maroon-800 dark:text-gold-400">
              కొండ దేవత అమ్మవారి దేవాలయం
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1" />

        <div className="flex items-center gap-2 sm:gap-4 relative z-50">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-saffron-500 dark:hover:text-gold-400 hover:bg-saffron-50 dark:hover:bg-white/5"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-gold-400" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
