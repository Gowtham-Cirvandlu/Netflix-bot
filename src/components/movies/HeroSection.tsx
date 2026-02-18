import React, { useState } from 'react'
import { Play, Info, Plus, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPosterUrl } from '@/api/omdb'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'

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

  const posterUrl = getPosterUrl(movie.Poster)
  const isInList = isInMyList(movie.imdbID)

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInList) {
      removeFromMyList(movie.imdbID)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <div className="relative h-[56.25vw] min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
      {/* Backdrop Image - Using poster as fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
          opacity: imageLoaded ? 0.3 : 0,
          transition: 'opacity 0.5s ease-in-out',
          filter: 'blur(30px)',
          transform: 'scale(1.1)'
        }}
      >
        {!imageLoaded && posterUrl && <div className="w-full h-full bg-gray-900" />}
      </div>

      {/* Enhanced Gradient Overlays - Netflix style */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 md:h-96 bg-gradient-to-t from-black to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-xl md:max-w-2xl flex flex-col md:flex-row gap-6 md:items-center">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
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

            {/* Movie Info */}
            <div className="flex-1">
              {/* Netflix-style massive title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg leading-tight">
                {movie.Title}
              </h1>

              {/* Movie Meta - Enhanced */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base text-gray-300">
                <span className="text-green-500 font-semibold text-lg md:text-xl">
                  {movie.imdbRating !== 'N/A' ? `${movie.imdbRating} Match` : 'N/A'}
                </span>
                <span className="text-gray-400">
                  {movie.Year}
                </span>
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {movie.Runtime}
                  </span>
                )}
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="border border-gray-500 px-2 py-1 text-xs text-gray-300 rounded-sm">
                    {movie.Rated}
                  </span>
                )}
                {/* HD Quality Badge */}
                <span className="border border-gray-500 px-2 py-1 text-xs text-gray-300 rounded-sm">
                  HD
                </span>
              </div>

              {/* Genre Pills */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.Genre.split(',').slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-800/90 rounded-full text-sm text-gray-200"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot - More visible */}
              <p className="text-gray-200 text-sm md:text-lg mb-6 line-clamp-3 md:line-clamp-4 drop-shadow-md font-medium">
                {movie.Plot || movie.Plot !== 'N/A' ? movie.Plot : 'No description available.'}
              </p>

              {/* Action Buttons - Netflix style */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white text-black hover:bg-white/90 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-md font-semibold"
                  onClick={() => {
                    // In a real app, this would play the trailer
                  }}
                >
                  <Play className="h-5 w-5 md:h-6 md:w-6 mr-2 fill-current" />
                  Play
                </Button>

                <Button
                  variant="outline"
                  className="bg-gray-500/40 hover:bg-gray-500/60 text-white text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-md font-semibold backdrop-blur-sm border-gray-400"
                  onClick={() => onShowDetails?.(movie)}
                >
                  <Info className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  More Info
                </Button>

                <Button
                  variant={isInList ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-full border-2 border-gray-400 h-12 w-12 md:h-14 md:w-14",
                    isInList ? "bg-netflix-red border-netflix-red" : "bg-black/40 border-gray-400 hover:border-white hover:bg-black/60"
                  )}
                  onClick={handleMyListToggle}
                >
                  {isInList ? (
                    <Check className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Image for Preloading */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt={movie.Title}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  )
}
