import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Play, Plus, Check, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getMovieDetails, getBackdropUrl, getPosterUrl } from '@/api/tmdb'
import { formatDate, formatRuntime, cn } from '@/lib/utils'
import type { Movie, MovieDetails } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'

interface MovieDetailModalProps {
  movie: Movie | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MovieDetailModal({ movie, open: _open, onOpenChange }: MovieDetailModalProps) {
  const { isInMyList, addToMyList, removeFromMyList } = useMyList()
  const [imageLoaded, setImageLoaded] = useState(false)

  const { data: movieDetails } = useQuery<MovieDetails>({
    queryKey: ['movie', 'details', movie?.id],
    queryFn: () => getMovieDetails(movie!.id),
    enabled: !!movie && _open,
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (!_open) {
      setImageLoaded(false)
    }
  }, [_open])

  if (!movie) return null

  const isInList = isInMyList(movie.id)
  const backdropUrl = getBackdropUrl(movieDetails?.backdrop_path || movie.backdrop_path, 'original')
  const posterUrl = getPosterUrl(movieDetails?.poster_path || movie.poster_path, 'w500')

  const handleMyListToggle = () => {
    if (isInList) {
      removeFromMyList(movie.id)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-gray-900 border-gray-800 p-0 overflow-hidden text-white">
        {/* Backdrop */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          {backdropUrl && (
            <>
              <img
                src={backdropUrl}
                alt={movie.title}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && <div className="absolute inset-0 bg-gray-800" />}
            </>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/80 text-white z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 pb-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-32 md:w-40 lg:w-48 rounded-lg overflow-hidden shadow-2xl">
                {posterUrl && (
                  <img src={posterUrl} alt={movie.title} className="w-full" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                {movie.title}
              </DialogTitle>

              <DialogDescription className="text-gray-400 mb-4">
                {movieDetails?.tagline || movie.overview}
              </DialogDescription>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="text-green-500 font-semibold">
                  {Math.round((movieDetails?.vote_average || movie.vote_average) * 10)}% Match
                </span>
                <span className="text-gray-400">
                  {movieDetails?.release_date ? formatDate(movieDetails.release_date) : movie.release_date}
                </span>
                {movieDetails?.runtime && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRuntime(movieDetails.runtime)}
                  </span>
                )}
                {movieDetails?.status && (
                  <span className="border border-gray-600 px-1.5 py-0.5 text-xs text-gray-400">
                    {movieDetails.status}
                  </span>
                )}
                {movie.adult && (
                  <span className="border border-gray-600 px-1.5 py-0.5 text-xs text-gray-400">
                    18+
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Play
                </Button>
                <Button
                  variant={isInList ? "default" : "outline"}
                  className={cn(
                    isInList ? "bg-netflix-red hover:bg-[#B81D24]" : "border-gray-600 text-white hover:bg-gray-800"
                  )}
                  onClick={handleMyListToggle}
                >
                  {isInList ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add to My List
                    </>
                  )}
                </Button>
              </div>

              {/* Genres */}
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {movieDetails?.overview || movie.overview || 'No description available.'}
                </p>
              </div>

              {/* Additional Info */}
              {movieDetails && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
                    <div>
                      <span className="text-gray-400">Production:</span>
                      <p>{movieDetails.production_companies.map(c => c.name).join(', ')}</p>
                    </div>
                  )}
                  {movieDetails.spoken_languages && movieDetails.spoken_languages.length > 0 && (
                    <div>
                      <span className="text-gray-400">Languages:</span>
                      <p>{movieDetails.spoken_languages.slice(0, 3).map(l => l.english_name).join(', ')}</p>
                    </div>
                  )}
                  {movieDetails.budget > 0 && (
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <p>${movieDetails.budget.toLocaleString()}</p>
                    </div>
                  )}
                  {movieDetails.revenue > 0 && (
                    <div>
                      <span className="text-gray-400">Revenue:</span>
                      <p>${movieDetails.revenue.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
