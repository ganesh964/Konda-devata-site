
import { NavLink } from 'react-router-dom'
import { Home, CalendarClock, Music, Compass, Tv } from 'lucide-react'
import { cn } from '../../lib/utils'

export function BottomNav() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Panchang', path: '/panchang', icon: CalendarClock },
    { name: 'Bhajans', path: '/bhajans', icon: Music },
    { name: 'Temples', path: '/temples', icon: Compass },
    { name: 'Live', path: '/darshan', icon: Tv },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-saffron-100/30 dark:border-maroon-800/30 lg:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center flex-1 py-1 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer",
                  isActive
                    ? "text-saffron-600 dark:text-gold-400 font-semibold"
                    : "hover:text-saffron-500 dark:hover:text-gold-300"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-5.5 w-5.5 transition-transform duration-200",
                      isActive && "scale-110 text-saffron-500 dark:text-gold-400"
                    )}
                  />
                  <span className="text-[10px] mt-1 font-medium tracking-wide">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
