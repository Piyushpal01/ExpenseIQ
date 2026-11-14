// Erro state component, displays API failure message and provide manual retry button

const IncomeError = ({ error, onRetry }) => {
    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center flex flex-col items-center">
            <div className="text-4xl mb-3 opacity-80">⚠️</div>
            <h3 className="text-lg font-medium text-red-400">Failed to load income records</h3>
            <p className="mt-2 text-sm text-red-300/70 max-w-sm">
                {error?.message || "Something went wrong while connecting to the server. Please check your connection."}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-5 px-5 py-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/30"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}

export default IncomeError