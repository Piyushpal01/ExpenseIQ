// Renders full list of expense records

import ExpenseCard from "./ExpenseCard"
import ExpenseSkeleton from "./ExpenseSkeleton"
import ExpenseError from "./ExpenseError"

const ExpenseList = ({ expenses, isPending, isError, error, onEdit, refetch }) => {
    
    // if expense is in loading state, render expenseSkeleton
    if(isPending) return <ExpenseSkeleton />

    // if any error comes, render incomeError
    if(isError) return <ExpenseError />

    // if there are no records
    if(!expenses.length > 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/20 p-12 text-center">
                <div className="text-4xl mb-4 opacity-50">💸</div>
                <h3 className="text-xl font-semibold text-gray-200">No expense records</h3>
                <p className="mt-2 text-sm text-gray-400">Add your first expense to start tracking your spending.</p>
            </div>
        )
    }

    // if all checks passed successfully
    return (
        <div className="flex flex-col gap-3 expense-list-container">
            {expenses.map((expense) => (
                <div key={expense.id} className="expense-card-wrapper">
                    <ExpenseCard expense={expense} onEdit={onEdit} />
                </div>
            ))}
        </div>
    )
}

export default ExpenseList