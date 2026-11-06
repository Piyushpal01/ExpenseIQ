// This component serves as loading screen if categories are still getting fetched

const CategorySkeleton = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse p-5 rounded-2xl bg-gray-800/20 border border-gray-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-xl shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-2/3 bg-gray-700/50 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-700/50 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CategorySkeleton