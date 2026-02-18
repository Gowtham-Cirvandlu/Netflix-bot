import { Skeleton } from '@/components/ui/skeleton'

interface MovieSkeletonProps {
  count?: number
}

export default function MovieSkeleton({ count = 6 }: MovieSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 min-w-[150px] md:min-w-[180px] lg:min-w-[200px]">
          <Skeleton className="w-full aspect-[2/3] mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
