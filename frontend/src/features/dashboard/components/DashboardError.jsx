// DashboardError.jsx => Renders a user-friendly error state when an API request fails, providing a clear error message and a functional "Retry" trigger to re-fetch the data.
// Error Screen on isError

const DashboardError = ({ error, onRetry }) => {
  const errorMessage = error?.response?.data?.detail || 'Please check your connection and try again.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="max-w-md rounded-2xl border border-rose-500/20 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400">
          <span className="text-2xl font-bold">!</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Unable to load dashboard
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          {errorMessage}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 w-full cursor-pointer rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
        >
          Retry Connection
        </button>
      </div>
    </main>
  )
}

export default DashboardError