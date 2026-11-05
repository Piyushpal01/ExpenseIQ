// On API fail this shows error box & retry option

const AccountError = ({ error, onRetry }) => {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-400">
                Unable to load accounts
            </h3>

            <p className="mt-2 text-sm text-red-300/70 mb-4">
                {/* Fallback chain for different API error structures */}
                {error?.response?.data?.detail || error?.message || 'Something went wrong. Please try again.'}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
                Try Again
            </button>
        </div>
    );
};

export default AccountError;