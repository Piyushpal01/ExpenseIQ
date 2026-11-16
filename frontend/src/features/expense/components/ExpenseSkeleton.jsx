// Skeleton loader for expense list. Displays pulsing placeholders while income data is fetched

const ExpenseSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/20 border border-gray-800 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-800"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-800 rounded"></div>
                            <div className="h-3 w-48 bg-gray-800 rounded"></div>
                        </div>
                    </div>
                    <div className="h-5 w-24 bg-gray-800 rounded"></div>
                </div>
            ))}
        </div>
    )
}

export default ExpenseSkeleton