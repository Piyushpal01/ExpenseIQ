// Renders full list of income records

import IncomeCard from "./IncomeCard"
import IncomeSkeleton from "./IncomeSkeleton"
import IncomeError from "./IncomeError"

const IncomeList = ({ incomes, isPending, isError, error, onEdit, refetch }) => {
    // if income is in loading state, render incomeSkeleton
    if (isPending) return <IncomeSkeleton />

    // if any error comes, render incomeError
    if (isError) return <IncomeError />

    // if there are no records
    if (!incomes?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-800/20 p-12 text-center">
                <div className="text-4xl mb-4 opacity-50">💸</div>
                <h3 className="text-xl font-semibold text-gray-200">No income records</h3>
                <p className="mt-2 text-sm text-gray-400">Add your first income to start tracking your earnings.</p>
            </div>
        )
    }

    // if all checks passed successfully
    return (
        <div className="flex flex-col gap-3 income-list-container">
            {incomes.map((income) => (
                <div key={income.id} className="income-card-wrapper">
                    <IncomeCard income={income} onEdit={onEdit} />
                </div>
            ))}
        </div>
    )
}

export default IncomeList