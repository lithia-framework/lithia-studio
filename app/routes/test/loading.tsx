export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 border-r border-white/10 p-6">
          <div className="space-y-6">
            {/* Method and Path */}
            <div className="space-y-4">
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-white/10 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-white/10 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-white/10 rounded animate-pulse"></div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
              </div>
              <div className="h-32 w-full bg-white/10 rounded animate-pulse"></div>
            </div>

            {/* Send Button */}
            <div className="h-10 w-full bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
            <div className="h-64 w-full bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
