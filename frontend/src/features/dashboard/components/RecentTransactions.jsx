// RecentTransactions => Listing the latest 5 transactions on dashboard

import { formatCurrency } from "../utils/formatCurrency"

const RecentTransactions = ({ recent_transactions = [] }) => {
    console.log("transactions = ", recent_transactions)

    return (
        <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                    Recent Transactions
                </h2>
                <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
                    Latest
                </span>
            </div>

            {recent_transactions.length === 0 ? (
                <p className="mt-6 text-sm text-slate-400">
                    No transactions recorded yet.
                </p>
            ) : (
                <div className="mt-2 divide-y divide-slate-800/60">
                    {recent_transactions.map((transaction) => (
                        <div
                            key={`${transaction.type}-${transaction.id}`}
                            className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-slate-800/20"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-200 group-hover:text-white transition-colors">
                                    {transaction.description || transaction.category}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {transaction.category}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-xs text-slate-500">
                                        {transaction.date}
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p
                                    className={`text-base font-bold tracking-tight ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RecentTransactions
