export default function Loading() {
  return (
    <div className="bg-background flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner principal */}
        <div className="loading-spinner relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10">
            <div className="border-t-primary absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent"></div>
          </div>
          <div
            className="border-r-primary/50 absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        {/* Texto de loading */}
        <div className="loading-text text-center">
          <h3 className="text-foreground mb-2 text-lg font-medium">
            Loading Route
          </h3>
          <p className="text-foreground/60 text-sm">
            Preparing route configuration...
          </p>
        </div>

        {/* Pontos animados */}
        <div className="loading-dots flex space-x-1">
          <div
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
