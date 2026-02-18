import { useState, useEffect } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import NetflixNavbar from '@/components/layout/NetflixNavbar'
import Footer from '@/components/layout/Footer'
import MovieCard from '@/components/movies/MovieCard'
import MovieDetailModal from '@/components/movies/MovieDetailModal'
import { useMovieSearch } from '@/hooks/useMovieSearch'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'

export default function Search() {
  const [query, setQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Use debounced search
  const { data: searchResults, isLoading: searchLoading, error } = useMovieSearch(
    query,
    1,
    query.length > 0
  )

  const handleShowDetails = (movie: Movie) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  // Focus search input on mount
  useEffect(() => {
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      searchInput.focus()
    }
  }, [])

  return (
    <div className="min-h-screen bg-netflix-black">
      <NetflixNavbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
              Search Movies
            </h1>
            
            {/* Search Input */}
            <div className="relative max-w-xl">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies..."
                className={cn(
                  "w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md",
                  "text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent",
                  "text-lg"
                )}
              />
            </div>
          </div>

          {/* Search Results */}
          <div>
            {searchLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">
                  Error loading search results
                </div>
                <p className="text-gray-600">
                  Please check your connection and try again.
                </p>
              </div>
            )}

            {!searchLoading && query.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl text-gray-400 mb-2">
                  Start typing to search for movies
                </h2>
                <p className="text-gray-600">
                  Find your next favorite movie by searching our database
                </p>
              </div>
            )}

            {!searchLoading && query.length > 0 && searchResults?.Search?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No results found for "{query}"
                </div>
                <p className="text-gray-600">
                  Try searching with different keywords
                </p>
              </div>
            )}

            {searchResults?.Search && searchResults.Search.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Search Results for "{query}"
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {searchResults.totalResults} movies found
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {searchResults.Search.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      onShowDetails={handleShowDetails}
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
