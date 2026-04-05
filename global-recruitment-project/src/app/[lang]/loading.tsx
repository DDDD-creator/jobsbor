export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-500">
      {/* Header Skeleton */}
      <div className="h-16 glass-nav">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-9 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="h-12 w-3/4 mx-auto bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-1/2 mx-auto bg-gray-700 rounded animate-pulse" />
            <div className="flex justify-center gap-4 pt-4">
              <div className="h-14 w-48 bg-gray-700 rounded animate-pulse" />
              <div className="h-14 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-700 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-20 w-full bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
