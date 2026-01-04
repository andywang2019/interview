export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-background border-b border-border h-16" />

      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-card rounded-lg border shadow-sm p-6 space-y-6 animate-pulse">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-muted rounded-2xl" />
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </main>

      <div className="bg-background border-t border-border h-32" />
    </div>
  )
}
