// On API pending state this show  skeleton loading grid

const AccountSkeleton = () => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="animate-pulse p-6 rounded-2xl bg-gray-800/20 border border-gray-700/30 h-50"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            {/* Icon Placeholder */}
                            <div className="w-12 h-12 bg-gray-700/50 rounded-xl"></div>
                            {/* Text Placeholders */}
                            <div className="space-y-2">
                                <div className="h-5 w-24 bg-gray-700/50 rounded"></div>
                                <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Balance Placeholder */}
                    <div className="mt-8 space-y-2">
                        <div className="h-3 w-20 bg-gray-700/50 rounded"></div>
                        <div className="h-8 w-32 bg-gray-700/50 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountSkeleton;