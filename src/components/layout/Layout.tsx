import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { BackgroundAmbience } from '../BackgroundAmbience'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export function Layout() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
    })
    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip w-full max-w-[100vw] bg-gradient-to-br from-[var(--color-gold-300)] to-[var(--color-saffron-500)] dark:from-[var(--color-saffron-800)] dark:to-[var(--color-maroon-800)]">
      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Center / Right Content Panel */}
        <main className="flex-1 flex flex-col min-w-0 px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-8 overflow-x-hidden">
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer at the bottom, outside main wrapper to span full page width */}
      <Footer />

      {/* Mobile Bottom Tabbar */}
      <BottomNav />

      <BackgroundAmbience />
    </div>
  )
}
