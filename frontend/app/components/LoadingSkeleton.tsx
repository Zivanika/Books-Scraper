export function BookCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "#ffff99",
        border: "3px solid #d4af37",
        borderRadius: "0",
        boxShadow: "4px 4px 0px rgba(0,0,0,0.3), inset 0 0 10px rgba(212,175,55,0.2)",
      }}
      className="relative shadow-lg border-2 border-amber-200 overflow-hidden animate-pulse"
    >
      <div className="p-4">
        {/* Image skeleton */}
        <div className="h-64 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg mb-4 border-2 border-amber-300"></div>
        
        {/* Title skeleton */}
        <div className="h-6 bg-amber-300 rounded mb-2 w-3/4"></div>
        
        {/* Author skeleton */}
        <div className="h-4 bg-amber-200 rounded mb-2 w-1/2"></div>
        
        {/* Category and price skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-amber-200 rounded w-1/3"></div>
          <div className="h-5 bg-amber-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}