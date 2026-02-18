import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, User, List, ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMyList } from '@/hooks/useMyList'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { name: 'Home', path: '/browse' },
  { name: 'TV Shows', path: '/browse?type=tv' },
  { name: 'Movies', path: '/browse?type=movie' },
  { name: 'New & Popular', path: '/browse?category=popular' },
  { name: 'My List', path: '/browse?list=mine' },
]

export default function NetflixNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useMyList()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsProfileOpen(false)
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8 md:space-x-10">
            {/* Netflix Logo - Larger */}
            <Link to="/" className="text-netflix-red font-bold text-3xl md:text-4xl tracking-tight hover:opacity-80 transition-opacity">
              NETFLIX
            </Link>

            {/* Navigation Items - Hidden on mobile */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6 md:space-x-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path ||
                    (item.path.includes('?') && location.pathname === '/browse' && location.search === item.path.split('?')[1])

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "text-sm md:text-base font-medium transition-colors hover:text-gray-300 relative group",
                        isActive ? "text-white" : "text-gray-300"
                      )}
                    >
                      {item.name}
                      {/* Netflix-style red underline for active tab */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red" />
                      )}
                      {/* Hover underline */}
                      {!isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                      )}
                      {item.name === 'My List' && count > 0 && (
                        <span className="ml-1 bg-netflix-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            {isAuthenticated && (
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300 hover:bg-white/10"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-300 hover:bg-white/10 hidden md:flex"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}

            {/* My List Indicator */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center text-sm text-gray-300">
                <List className="h-4 w-4 mr-1" />
                <span>{count}</span>
              </div>
            )}

            {/* Authentication/Profile Section */}
            {isAuthenticated ? (
              /* Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-9 h-9 bg-netflix-red rounded flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-800 rounded-md shadow-xl backdrop-blur-sm">
                    <div className="py-1">
                      <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-800">
                        <div className="font-medium text-white">
                          {user?.full_name || 'User'}
                        </div>
                        <div className="text-gray-400 text-xs">{user?.email}</div>
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
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-gray-300 hover:bg-white/10 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-netflix-red hover:bg-red-700 text-white font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}