// Displays single Income transaction record, Handles formatting for amount/date, triggers Edit/Delete actions

import { useDeleteIncome } from "../hooks/useIncome"

const IncomeCard = ({ income, onEdit }) => {
    const deleteMutation = useDeleteIncome()

    // delete handler - prompts confirmation before delete
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ₹${income.amount} income?`)) {
            deleteMutation.mutate(income.id)
        }
    }

    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/40">

            {/* Icon & Details Section */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                    <h3 className="text-gray-200 font-medium">{income.description}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 tracking-wide">
                        {income.category_name} • {income.account_name} • {new Date(income.transaction_date).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Amount & Action Buttons */}
            <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-semibold tracking-wide">
                    +₹{parseFloat(income.amount).toFixed(2)}
                </span>

                {/* Actions show on hover for cleaner UI */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(income)}
                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default IncomeCard
