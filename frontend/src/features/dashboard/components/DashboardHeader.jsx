// DashboardHeader.jsx => Displaying the welcome message, date, and period selector

const DashboardHeader = ({ user, onLogout }) => {
    console.log(user)
    return (
        <header className="dash-header flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
            <div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                    <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                        ExpenseIQ
                    </p>
                </div>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Dashboard
                </h1>

                {/* show user's name, if there is no name, show email, else user */}
                <p className="mt-1 text-sm font-medium text-slate-400">
                    Welcome back, <span className="text-slate-200">{user?.first_name || user?.email || 'User'}</span>
                </p>
            </div>

            <button
                onClick={onLogout}
                className="cursor-pointer rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
            >
                Logout
            </button>
        </header>
    )
}

export default DashboardHeader