// Displays a Pie Chart of expenses grouped by category

import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "../../../utils/formatCurrency"

const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#d946ef', '#f43f5e', '#a855f7']

const ExpenseCategoryChart = ({ data = [] }) => {
    // Prevent rendering an empty or broken chart if no expense data exists
    if(!data || data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 text-sm text-slate-400">
                No expense data available for chart.
            </div>
        )
    }

    // Attach 'fill' color directly to each data item
    const coloredData = data.map((entry, index) => ({
        ...entry,   // Copy existing properties ('category' and 'amount') unchanged
        // Assign a color from COLORS array, cycling back to start using modulo (%)
        fill: COLORS[index % COLORS.length]
    }))

    return (
        <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
                Expense by Category
            </h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={coloredData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="amount"
                            nameKey="category"
                        />
                        <Tooltip 
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc', fontWeight: '500' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ExpenseCategoryChart