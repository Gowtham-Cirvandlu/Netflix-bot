import React, { useState } from 'react'
import { Play, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPosterUrl } from '@/api/omdb'
import { cn } from '@/lib/utils'
import type { Movie } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'

interface MovieCardProps {
   
  movie: Movie
   
  onShowDetails?: (movie: Movie) => void
   
  size?: 'small' | 'medium' | 'large'
}

export default function MovieCard({ movie, onShowDetails, size = 'medium' }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isInMyList, addToMyList, removeFromMyList } = useMyList()

  const posterUrl = getPosterUrl(movie.Poster)
  const isInList = isInMyList(movie.imdbID)

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList) {
      removeFromMyList(movie.imdbID)
    } else {
      addToMyList(movie)
    }
  }

  const handleCardClick = () => {
    onShowDetails?.(movie)
  }

  const sizeClasses = {
    small: 'min-w-[120px] w-[120px] md:min-w-[150px] md:w-[150px]',
    medium: 'min-w-[150px] w-[150px] md:min-w-[180px] md:w-[180px] lg:min-w-[200px] lg:w-[200px]',
    large: 'min-w-[180px] w-[180px] md:min-w-[220px] md:w-[220px] lg:min-w-[250px] lg:w-[250px]',
  }

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all duration-300',
        sizeClasses[size],
        isHovered && 'z-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Card Image */}
      <div className={cn(
        "relative overflow-hidden rounded-md bg-gray-800 aspect-[2/3] transition-transform duration-300 ease-out",
        isHovered && "scale-150 shadow-2xl"
      )}>
        {posterUrl ? (
          <>
            <img
              src={posterUrl}
              alt={movie.Title}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-center p-2">No Poster</span>
          </div>
        )}

        {/* Netflix-style gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 transition-all duration-300",
          isHovered ? "bg-gradient-to-t from-black via-black/60 to-black/20 opacity-100" : "opacity-0"
        )} />

        {/* Play button overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110">
              <Play className="w-5 h-5 text-black fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Rating Badge (when not hovered) */}
        {!isHovered && movie.imdbRating !== 'N/A' && (
          <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white font-medium">
            {movie.imdbRating}
          </div>
        )}

        {/* Movie Info on hover */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity duration-300">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white text-sm font-medium truncate">
                {movie.Title}
              </h4>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/80 text-white flex-shrink-0"
                onClick={handleMyListToggle}
              >
                {isInList ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500 font-medium">
                {movie.imdbRating !== 'N/A' ? `${movie.imdbRating} Match` : 'N/A'}
              </span>
              <span className="text-gray-300 border border-gray-600 px-1 text-[10px]">
                HD
              </span>
              <span className="text-gray-300">
                {movie.Year}
              </span>
            </div>
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.Genre.split(',').slice(0, 2).map((genre) => (
                  <span key={genre} className="text-[10px] text-gray-300">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
