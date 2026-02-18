import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, User, List, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMyList } from '@/hooks/useMyList'

const navItems = [
  { name: 'Home', path: '/browse' },
  { name: 'TV Shows', path: '/browse?type=tv' },
  { name: 'Movies', path: '/browse?type=movie' },
  { name: 'New & Popular', path: '/browse?category=popular' },
  { name: 'My List', path: '/browse?list=mine' },
]

export default function NetflixNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const { myList, count } = useMyList()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Netflix Logo */}
            <Link to="/" className="text-netflix-red font-bold text-2xl tracking-tight">
              NETFLIX
            </Link>

            {/* Navigation Items - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path.includes('?') && location.pathname === '/browse' && location.search === item.path.split('?')[1])
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-gray-300",
                      isActive ? "text-white" : "text-gray-400"
                    )}
                  >
                    {item.name}
                    {item.name === 'My List' && count > 0 && (
                      <span className="ml-1 bg-netflix-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Link to="/search">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:text-gray-300 hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-gray-300 hover:bg-white/10 hidden md:flex"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* My List Indicator */}
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <List className="h-4 w-4 mr-1" />
              <span>{count}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
              >
                <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-800 rounded-md shadow-lg">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800">
                      <div className="font-medium">Netflix Bot</div>
                      <div className="text-gray-400">Movie Discovery</div>
                    </div>
                    <Link
                      to="/browse"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Browse Movies
                    </Link>
                    <Link
                      to="/search"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Search Movies
                    </Link>
                    {count > 0 && (
                      <Link
                        to="/browse?list=mine"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My List ({count})
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
