import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import NetflixNavbar from '@/components/layout/NetflixNavbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/movies/HeroSection'
import MovieRow from '@/components/movies/MovieRow'
import MovieDetailModal from '@/components/movies/MovieDetailModal'
import PremiumGateModal from '@/components/movies/PremiumGateModal'
import ErrorDisplay from '@/components/ErrorDisplay'
import { 
  usePopularMovies, 
  useTrendingMovies, 
  useTopRatedMovies,
  useFeaturedMovie 
} from '@/hooks/useMovies'
import { useMyList } from '@/hooks/useMyList'
import { useAuth } from '@/context/AuthContext'
import type { Movie } from '@/types/movie'

export default function Browse() {
  const [searchParams] = useSearchParams()
  const listType = searchParams.get('list')
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [premiumModalOpen, setPremiumModalOpen] = useState(false)
  const isPremium = isAuthenticated && user?.subscription_status === 'premium'
  const isGuest = !isAuthenticated

  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useFeaturedMovie()
  const { data: popularData, isLoading: popularLoading, error: popularError } = usePopularMovies()
  const { data: trendingData, isLoading: trendingLoading, error: trendingError } = useTrendingMovies()
  const { data: topRatedData, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies()
  
  const { myList } = useMyList()

  const handleShowDetails = (movie: Movie) => {
    // Show premium gate for guests or free users trying to access premium content
    if (isGuest || !isPremium) {
      setSelectedMovie(movie)
      setPremiumModalOpen(true)
      return
    }
    
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  const handleRetry = () => {
    queryClient.invalidateQueries()
  }

  const showMyListOnly = listType === 'mine'

  const hasError = !!(featuredError || popularError || trendingError || topRatedError)
  const isLoading = featuredLoading || popularLoading || trendingLoading || topRatedLoading
  const hasMovies =
    (popularData && popularData.length > 0) ||
    (trendingData && trendingData.length > 0) ||
    (topRatedData && topRatedData.length > 0)

  return (
    <div className="min-h-screen bg-netflix-black">
      <NetflixNavbar />
      
      <main className="pt-16">
        {!showMyListOnly && (
          <HeroSection 
            movie={featuredData || null}
            isLoading={featuredLoading}
            onShowDetails={handleShowDetails}
          />
        )}

        <div className={showMyListOnly ? 'pt-8' : 'pb-12'}>
          {showMyListOnly ? (
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 px-4 md:px-8">
                My List
              </h2>
              {myList.length > 0 ? (
                <MovieRow
                  title=""
                  movies={myList}
                  onShowDetails={handleShowDetails}
                />
              ) : (
                <div className="px-4 md:px-8 py-12 text-center">
                  <div className="text-gray-500 text-lg mb-4">
                    Your list is empty
                  </div>
                  <p className="text-gray-600">
                    Add movies to your list by clicking the + button on any movie card.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {!isLoading && hasError && !hasMovies ? (
                <ErrorDisplay
                  title="Couldn't load movies"
                  message="We had trouble connecting to the movie database. Please check your connection and try again."
                  onRetry={handleRetry}
                />
              ) : (
                <>
                  <MovieRow
                    title="Popular Movies"
                    movies={popularData || []}
                    isLoading={popularLoading}
                    onShowDetails={handleShowDetails}
                  />
                  <MovieRow
                    title="Trending Now"
                    movies={trendingData || []}
                    isLoading={trendingLoading}
                    onShowDetails={handleShowDetails}
                  />
                  <MovieRow
                    title="Top Rated"
                    movies={topRatedData || []}
                    isLoading={topRatedLoading}
                    onShowDetails={handleShowDetails}
                  />

                  {myList.length > 0 && (
                    <MovieRow
                      title="My List"
                      movies={myList}
                      onShowDetails={handleShowDetails}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <MovieDetailModal
        movie={selectedMovie}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <PremiumGateModal
        movie={selectedMovie}
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
        isGuest={isGuest}
      />
    </div>
  )
}
