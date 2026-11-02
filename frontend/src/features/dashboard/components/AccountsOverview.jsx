// AccountsOverview.jsx => Displaying the user's connected accounts and their balances on dashboard

import { formatCurrency } from "../utils/formatCurrency"

const AccountsOverview = ({ accounts = [] }) => {
    console.log("Acc array => ", accounts)

    return (
        <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                    Your Accounts
                </h2>
                <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
                    {accounts?.length || 0} Total
                </span>
            </div>

            {/* All accounts, extracting from acccounts array */}
            {accounts.length === 0 ? (
                <p className="mt-6 text-sm text-slate-400">
                    No accounts added yet.
                </p>
            ) : (
                <div className="mt-2 divide-y divide-slate-800/60">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="group flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-slate-800/20"
                        >
                            <div>
                                <p className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                                    {account.acc_name}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                                    {account.acc_type.replaceAll('_', ' ')}
                                </p>
                            </div>

                            <p className="font-bold text-slate-100">
                                {formatCurrency(account.acc_balance)}
                            </p>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AccountsOverview