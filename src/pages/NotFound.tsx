import { Link } from 'react-router-dom'
import { Home, Search, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NetflixNavbar from '@/components/layout/NetflixNavbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black">
      <NetflixNavbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 text-center">
          {/* Error Code */}
          <div className="text-[150px] md:text-[200px] font-bold text-netflix-red leading-none">
            404
          </div>
          
          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button className="bg-netflix-red hover:bg-netflix-red-dark text-white">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Search className="h-5 w-5 mr-2" />
                Search Movies
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
