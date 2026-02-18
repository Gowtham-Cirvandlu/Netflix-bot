import { useState, useEffect } from 'react'
import { Play, Plus, Check, Clock, Star, X, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getPosterUrl } from '@/api/omdb'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'

interface MovieDetailModalProps {

  movie: Movie | null

  open: boolean

  onOpenChange: (open: boolean) => void
}

export default function MovieDetailModal({ movie, open: _open, onOpenChange }: MovieDetailModalProps) {
  const { isInMyList, addToMyList, removeFromMyList } = useMyList()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!_open) {
      setImageLoaded(false)
    }
  }, [_open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && _open) {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [_open, onOpenChange])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (_open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [_open])

  if (!movie) return null

  const isInList = isInMyList(movie.imdbID)
  const posterUrl = getPosterUrl(movie.Poster)

  const handleMyListToggle = () => {
    if (isInList) {
      removeFromMyList(movie.imdbID)
    } else {
      addToMyList(movie)
    }
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={_open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-gray-900 border-gray-800 p-0 overflow-hidden text-white max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Backdrop / Poster */}
        <div className="relative h-[200px] md:h-[300px] overflow-hidden backdrop-blur-sm">
          {posterUrl ? (
            <>
              <img
                src={posterUrl}
                alt={movie.Title}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500 opacity-30 blur-[30px] scale-110",
                  imageLoaded ? "opacity-30" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && <div className="absolute inset-0 bg-gray-800" />}
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Close Button - Fixed with proper z-index */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all duration-200 flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 pb-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-32 md:w-40 lg:w-48 rounded-lg overflow-hidden shadow-2xl">
                {posterUrl ? (
                  <img 
                    src={posterUrl} 
                    alt={movie.Title} 
                    className="w-full"
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Poster</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                {movie.Title}
              </DialogTitle>

              <DialogDescription className="text-gray-400 mb-4">
                {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No description available.'}
              </DialogDescription>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="text-green-500 font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'}
                </span>
                <span className="text-gray-400">
                  {movie.Year}
                </span>
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {movie.Runtime}
                  </span>
                )}
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="border border-gray-600 px-1.5 py-0.5 text-xs text-gray-400">
                    {movie.Rated}
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
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(',').map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview - Already shown above, keeping for structure */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No description available.'}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <p>{movie.Director}</p>
                  </div>
                )}
                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div>
                    <span className="text-gray-400">Cast:</span>
                    <p className="line-clamp-2">{movie.Actors}</p>
                  </div>
                )}
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <span className="text-gray-400">Writer:</span>
                    <p className="line-clamp-2">{movie.Writer}</p>
                  </div>
                )}
                {movie.Released && movie.Released !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-400">Released:</span>
                    <p>{formatDate(movie.Released)}</p>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-400 text-sm mb-2">Ratings</h4>
                  <div className="flex flex-wrap gap-3">
                    {movie.Ratings.map((rating) => (
                      <div 
                        key={rating.Source} 
                        className="bg-gray-800 px-3 py-1 rounded text-sm"
                      >
                        <span className="text-gray-400">{rating.Source}:</span>{' '}
                        <span className="text-white font-medium">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
