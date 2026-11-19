// Displays single Expense transaction record, Handles formatting for amount/date, triggers Edit/Delete actions

import { useDeleteExpense } from "../hooks/useExpense"

const ExpenseCard = ({ expense, onEdit }) => {
    const deleteMutation = useDeleteExpense()

    // prompt confirmation before delete
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ₹${expense.amount} expense?`)) {
            deleteMutation.mutate(expense.id)
        }
    }

    return (
        <div className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/40">

            {/* Icon & Details Section */}
            {/* [UPDATED]: Added min-w-0 to prevent long text from breaking layout on mobile */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                </div>

                <div className="min-w-0">
                    <h3 className="text-gray-200 font-medium truncate">{expense.description}</h3>
                    {/* [UPDATED]: Order fixed to Account -> Category -> Date + (Deleted) tag */}
                    <p className="text-xs text-gray-500 mt-0.5 tracking-wide truncate">
                        {expense.account_name}
                        {expense.account_is_active === false && (
                            <span className="text-gray-400"> (Deleted)</span>
                        )}
                        {" • "}
                        {expense.category_name}
                        {expense.category_is_active === false && (
                            <span className="text-gray-400"> (Deleted)</span>
                        )}
                        {" • "}
                        {new Date(expense.date).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Amount & Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="text-rose-400 font-semibold tracking-wide">
                    -₹{parseFloat(expense.amount).toFixed(2)}
                </span>

                {/* [UPDATED]: Visible on mobile touchscreens, hover-reveal on desktop (sm+) */}
                <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(expense)}
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

export default ExpenseCard