import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MovieCard from './MovieCard'
import type { Movie } from '@/types/movie'
import { cn } from '@/lib/utils'

interface MovieRowProps {
  title: string
  movies: Movie[]
  isLoading?: boolean
  onShowDetails?: (movie: Movie) => void
}

export default function MovieRow({ title, movies, isLoading, onShowDetails }: MovieRowProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    
    const scrollAmount = direction === 'left' ? -600 : 600
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-8">
          {title}
        </h2>
        <div className="flex gap-4 px-4 md:px-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px] h-[280px] md:h-[320px] lg:h-[360px] bg-gray-800 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className="mb-8 group/row">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 px-4 md:px-8 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <MovieCard 
                movie={movie} 
                onShowDetails={onShowDetails}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
