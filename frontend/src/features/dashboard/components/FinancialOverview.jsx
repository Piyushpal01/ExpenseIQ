// FinancialOverview.jsx => Managing the financial summary section for dashboard
// This component organizes the four financial stat cards into a single section. Since the StatCard is already ready, reusing it.

import StatCard from './StatCard'

const FinancialOverview = ({ data }) => {
    console.log("data => ", data);

    return (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                type="income"
                title="Total Income"
                amount={data.total_income}
                description="Income recorded in ExpenseIQ"
            />
            <StatCard
                type="expense"
                title="Total Expenses"
                amount={data.total_expense}
                description="Expenses recorded in ExpenseIQ"
            />
            <StatCard
                type="net"
                title="Net Balance"
                amount={data.net_balance}
                description="Net Balance, which is Income minus Expenses"
            />
            <StatCard
                type="default"
                title="Account Balance"
                amount={data.total_account_balance}
                description="Combined balance of all user accounts"
            />
        </section>
    )
}

export default FinancialOverview