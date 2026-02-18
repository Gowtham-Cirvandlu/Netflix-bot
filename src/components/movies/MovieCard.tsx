import React, { useState } from 'react'
import { Play, Plus, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPosterUrl } from '@/api/tmdb'
import { cn, getYearFromDate } from '@/lib/utils'
import type { Movie } from '@/types/movie'
import { useMyList } from '@/hooks/useMyList'

/* eslint-disable no-unused-vars */
interface MovieCardProps {
  movie: Movie
  onShowDetails?: (movie: Movie) => void
  size?: 'small' | 'medium' | 'large'
}
/* eslint-enable no-unused-vars */

export default function MovieCard({ movie, onShowDetails, size = 'medium' }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isInMyList, addToMyList, removeFromMyList } = useMyList()

  const posterUrl = getPosterUrl(movie.poster_path, size === 'small' ? 'w185' : size === 'large' ? 'w500' : 'w342')
  const isInList = isInMyList(movie.id)

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList) {
      removeFromMyList(movie.id)
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
        isHovered && 'z-20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Card Image */}
      <div className={cn(
        "relative overflow-hidden rounded-md bg-gray-800 aspect-[2/3]",
        isHovered && "movie-card-hover"
      )}>
        {posterUrl && (
          <>
            <img
              src={posterUrl}
              alt={movie.title}
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
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 transition-opacity duration-200">
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full bg-black/50 hover:bg-black/80 text-white"
                onClick={handleMyListToggle}
              >
                {isInList ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>

            {/* Info at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-white text-sm font-medium truncate mb-1">
                {movie.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-green-500 font-medium">
                  {Math.round(movie.vote_average * 10)}%
                </span>
                <span>{getYearFromDate(movie.release_date)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rating Badge (when not hovered) */}
        {!isHovered && (
          <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white font-medium">
            {Math.round(movie.vote_average * 10)}%
          </div>
        )}
      </div>

      {/* Expanded Card (Shows on hover) */}
      {isHovered && (
        <div className="absolute top-0 left-0 right-0 bg-gray-900 rounded-md overflow-hidden shadow-2xl z-30">
          {/* Expanded Image */}
          <div className="aspect-[2/3] relative">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Expanded Actions */}
          <div className="p-3 space-y-2">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-white text-black hover:bg-gray-200"
              >
                <Play className="h-4 w-4 mr-1 fill-current" />
                Play
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={handleMyListToggle}
              >
                {isInList ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => onShowDetails?.(movie)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Movie Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500 font-medium">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="border border-gray-600 px-1 text-gray-400">
                  HD
                </span>
                {movie.adult && (
                  <span className="border border-gray-600 px-1 text-gray-400">
                    18+
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {movie.genre_ids?.slice(0, 3).map((genreId) => (
                  <span key={genreId} className="text-xs text-gray-400">
                    • Genre {genreId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
