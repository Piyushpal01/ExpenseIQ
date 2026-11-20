// TransactionFilters.jsx => Reusable sticky utility panel for server-side search, filtering, and ordering

import { useEffect, useMemo, useState } from "react"
import { useAccounts } from "../../features/accounts/hooks/useAccounts"
import { useCategories } from "../../features/categories/hooks/useCategories"

// Default API sort order: newest date and creation timestamp first
const DEFAULT_ORDERING = "-date, -created_at"

const TransactionFilters = ({ type = "expense", filters, onChange, onReset, isFetching }) => {
    // API Fetch, destructure acocunts and categories with empty fallback
    const { data: accounts = [] } = useAccounts()
    const { data: allCategories = [] } = useCategories()

    // Local state for debounced search input
    const [searchInput, setSearchInput] = useState(filters.search || "")

    // Sync local input if filters are reset externally
    useEffect(() => {
        setSearchInput(filters.search || "")
    }, [filters.search])

    // Debounce / Delay search by 350ms to prevent API spam on every keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            if(searchInput !== (filters.search || "")) {
                onChange("search", searchInput.trim())
            }
        }, 350)
        
        return () => clearTimeout(timer)
    }, [searchInput, filters.search])

    // Filter active categories matching current page type (INCOME / EXPENSE)
    const relevantCategories = useMemo(() => {
        return allCategories.filter(
            (cat) => cat.is_active === true &&
            (cat.category_type || "").toUpperCase() === type.toUpperCase()
        )
    }, [allCategories, type])

    // Check if any filter or custom sort is currently active
    const hasActiveFilters = Boolean(
        filters.search || 
        filters.account ||
        filters.category ||
        filters.date ||
        (filters.ordering && filters.ordering !== DEFAULT_ORDERING)
    )

    // Set input focus border accent based on transaction type
    const focusRing = (type === "income") ? "focus:border-emerald-500" : "focus:border-rose-500"

    // Set "Clear All" button theme colors based on transaction type
    const badgeColor = (type === "income") ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border-rose-500/30"

    return (
        <aside className="rounded-2xl border border-slate-800/80 bg-slate-900/55 p-5 backdrop-blur-xl shadow-lg lg:sticky lg:top-24">
            {/* Panel Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                        Search & Filters
                    </h2>
                    {isFetching && (
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-500 border-t-white animate-spin" />
                    )}
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-85 ${badgeColor}`}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Search by description */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Search Description
                    </label>

                    <div className="relative">
                        <svg
                            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={type === "income" ? "e.g. Salary, Freelance..." : "e.g. Bills, Groceries..."}
                            className={`w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none ${focusRing}`}
                        />
                    </div>
                </div>

                {/* Sort / Ordering */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Sort By
                    </label>

                    <select
                        value={filters.ordering || DEFAULT_ORDERING}
                        onChange={(e) => onChange("ordering", e.target.value)}
                        className={`w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white transition-colors focus:outline-none ${focusRing}`}
                    >
                        <option value="-date,-created_at">Newest First</option>
                        <option value="date">Oldest First</option>
                        <option value="-amount">Highest Amount</option>
                        <option value="amount">Lowest Amount</option>
                    </select>
                </div>

                {/* Account Filter */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Account
                    </label>

                    <select
                        value={filters.account || ""}
                        onChange={(e) => onChange("account", e.target.value)}
                        className={`w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white transition-colors focus:outline-none ${focusRing}`}
                    >
                        <option value="">All Accounts</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.acc_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Category
                    </label>

                    <select
                        value={filters.category || ""}
                        onChange={(e) => onChange("category", e.target.value)}
                        className={`w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white transition-colors focus:outline-none ${focusRing}`}
                    >
                        <option value="">All Categories</option>
                        {relevantCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Exact Date Filter */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                        Specific Date
                    </label>

                    <input
                        type="date"
                        value={filters.date || ""}
                        onChange={(e) => onChange("date", e.target.value)}
                        className={`w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white scheme-dark transition-colors focus:outline-none ${focusRing}`}
                    />
                </div>
            </div>
        </aside>
    )
}

export default TransactionFilters