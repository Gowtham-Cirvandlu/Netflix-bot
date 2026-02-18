interface MovieSkeletonProps {
  count?: number
}

export default function MovieSkeleton({ count = 6 }: MovieSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 min-w-[150px] md:min-w-[180px] lg:min-w-[200px]">
          {/* Netflix-style shimmer skeleton */}
          <div className="relative w-full aspect-[2/3] bg-gray-800 rounded-md overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-netflix-red rounded-full animate-spin" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
