import { Play, Info, Plus, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBackdropUrl, getPosterUrl } from '@/api/tmdb'
import { cn, formatDate, getYearFromDate } from '@/lib/utils'
import type { Movie } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'
import { useState } from 'react'

interface HeroSectionProps {
  movie: Movie | null
  isLoading?: boolean
  onShowDetails?: (movie: Movie) => void
}

export default function HeroSection({ movie, isLoading, onShowDetails }: HeroSectionProps) {
  const { isInMyList, addToMyList, removeFromMyList } = useMyList()
  const [imageLoaded, setImageLoaded] = useState(false)

  if (isLoading) {
    return (
      <div className="relative h-[56.25vw] min-h-[500px] md:min-h-[600px] bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>
    )
  }

  if (!movie) {
    return null
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original')
  const posterUrl = getPosterUrl(movie.poster_path, 'w500')
  const isInList = isInMyList(movie.id)

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInList) {
      removeFromMyList(movie.id)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <div className="relative h-[56.25vw] min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
      {/* Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {!imageLoaded && <div className="w-full h-full bg-gray-900" />}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 md:h-64 bg-gradient-to-t from-black to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-xl md:max-w-2xl">
            {/* Movie Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Movie Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-300">
              <span className="text-green-500 font-semibold">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              <span className="text-gray-400">
                {getYearFromDate(movie.release_date)}
              </span>
              <span className="border border-gray-500 px-1.5 py-0.5 text-xs">
                HD
              </span>
              {movie.adult && (
                <span className="border border-gray-500 px-1.5 py-0.5 text-xs">
                  18+
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-4 drop-shadow-md">
              {movie.overview || 'No description available.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                className="bg-white text-black hover:bg-white/90 text-sm md:text-base px-6 md:px-8"
                onClick={() => {
                  // In a real app, this would play the trailer
                }}
              >
                <Play className="h-4 w-4 md:h-5 md:w-5 mr-2 fill-current" />
                Play
              </Button>

              <Button 
                variant="netflixSecondary"
                className="text-sm md:text-base px-6 md:px-8"
                onClick={() => onShowDetails?.(movie)}
              >
                <Info className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                More Info
              </Button>

              <Button
                variant={isInList ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-full border-2 border-gray-400",
                  isInList ? "bg-netflix-red border-netflix-red" : "bg-black/50 border-gray-400 hover:border-white"
                )}
                onClick={handleMyListToggle}
              >
                {isInList ? (
                  <Check className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Plus className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Image for Preloading */}
      <img 
        src={backdropUrl} 
        alt={movie.title}
        className="hidden"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}
