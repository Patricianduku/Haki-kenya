import { Loader2, Search, Users, FileText, BookOpen } from "lucide-react"
import { Skeleton } from "./skeleton"

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const Loading = ({ 
  type = 'spinner', 
  size = 'md', 
  text = 'Loading...',
  className = '' 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm text-muted-foreground ml-2">{text}</span>
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`}></div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    )
  }

  return null
}

// Skeleton loaders for specific content types
export const LawyerCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-soft animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
)

export const GuideCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-soft animate-pulse">
    <div className="flex items-start justify-between mb-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-16" />
    </div>
    <Skeleton className="h-6 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center gap-1">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-20" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
)

export const SearchSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-soft animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
)

export const PageSkeleton = () => (
  <div className="min-h-screen bg-muted/30">
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      
      {/* Search Skeleton */}
      <SearchSkeleton />
      
      {/* Results Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-48" />
      </div>
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GuideCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
) 