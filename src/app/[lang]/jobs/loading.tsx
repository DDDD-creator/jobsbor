export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-500 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-12 flex-1 bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Job Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-700 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-16 w-full bg-gray-700 rounded animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-64 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
