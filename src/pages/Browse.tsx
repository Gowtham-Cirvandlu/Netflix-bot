import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NetflixNavbar from '@/components/layout/NetflixNavbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/movies/HeroSection'
import MovieRow from '@/components/movies/MovieRow'
import MovieDetailModal from '@/components/movies/MovieDetailModal'
import { usePopularMovies, useTrendingMovies, useTopRatedMovies, useUpcomingMovies, useFeaturedMovie } from '@/hooks/useMovies'
import { useMyList } from '@/hooks/useMyList'
import type { Movie } from '@/types/movie'

export default function Browse() {
  const [searchParams] = useSearchParams()
  const listType = searchParams.get('list')
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch movie data
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedMovie()
  const { data: trendingData, isLoading: trendingLoading } = useTrendingMovies()
  const { data: popularData, isLoading: popularLoading } = usePopularMovies()
  const { data: topRatedData, isLoading: topRatedLoading } = useTopRatedMovies()
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingMovies()
  
  // My List
  const { myList } = useMyList()

  const handleShowDetails = (movie: Movie) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  // Check if showing My List only
  const showMyListOnly = listType === 'mine'

  return (
    <div className="min-h-screen bg-netflix-black">
      <NetflixNavbar />
      
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section - Only show on main browse (not My List) */}
        {!showMyListOnly && (
          <HeroSection 
            movie={featuredData || null}
            isLoading={featuredLoading}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* Movie Rows */}
        <div className={showMyListOnly ? 'pt-8' : 'pb-12'}>
          {showMyListOnly ? (
            // My List View
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
            // All Categories
            <>
              <MovieRow
                title="Trending Now"
                movies={trendingData?.results || []}
                isLoading={trendingLoading}
                onShowDetails={handleShowDetails}
              />
              <MovieRow
                title="Popular Movies"
                movies={popularData?.results || []}
                isLoading={popularLoading}
                onShowDetails={handleShowDetails}
              />
              <MovieRow
                title="Top Rated"
                movies={topRatedData?.results || []}
                isLoading={topRatedLoading}
                onShowDetails={handleShowDetails}
              />
              <MovieRow
                title="Upcoming"
                movies={upcomingData?.results || []}
                isLoading={upcomingLoading}
                onShowDetails={handleShowDetails}
              />
              
              {/* My List Section (if not empty) */}
              {myList.length > 0 && (
                <MovieRow
                  title="My List"
                  movies={myList}
                  onShowDetails={handleShowDetails}
                />
              )}
            </>
          )}
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
