// DashboardSkeleton.jsx => Displays a visual placeholder structure (skeleton loader) to maintain layout consistency while the dashboard API data is actively loading.
// Skeleton Screen on isPending

const DashboardSkeleton = () => {
    return (
        <main className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
            <div className="mx-auto max-w-7xl animate-pulse space-y-8">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div className="space-y-3">
                        <div className="h-4 w-28 rounded bg-slate-800" />
                        <div className="h-8 w-48 rounded bg-slate-800" />
                    </div>

                    <div className="h-10 w-24 rounded-lg bg-slate-800" />
                </div>

                {/* Financial overview skeleton */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-36 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6" />
                    ))}
                </div>
                
                {/* Dashboard content skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
                    <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
                </div>
            </div>
        </main>
    )
}

export default DashboardSkeleton