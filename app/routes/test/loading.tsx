export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner principal */}
        <div className="relative loading-spinner">
          <div className="w-16 h-16 border-4 border-white/10 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/50 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Texto de loading */}
        <div className="text-center loading-text">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Loading Route
          </h3>
          <p className="text-sm text-foreground/60">
            Preparing route configuration...
          </p>
        </div>

        {/* Pontos animados */}
        <div className="flex space-x-1 loading-dots">
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
