// if Category load fail, this component show error banner and retry button

const CategoryError = ({ error, onRetry }) => {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-400">
                Failed to load Categories
            </h3>

            <p className="mt-1 text-sm text-red-300/70 mb-4">
                {error?.response?.data?.detail || error?.message || 'Something went wrong.'}
            </p>

            <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
                Try Again
            </button>
        </div>
    )
}

export default CategoryError