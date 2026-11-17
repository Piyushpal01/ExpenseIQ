// Displays a Pie Chart of income grouped by category

import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "../../../utils/formatCurrency"

const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#14b8a6', '#0ea5e9', '#6366f1']

const IncomeCategoryChart = ({ data = [] }) => {
    // Prevent rendering an empty or broken chart if no expense data exists
    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 text-sm text-slate-400">
                No income data available for chart.
            </div>
        )
    }

    // Attach 'fill' color directly to each data item
    const coloredData = data.map((entry, index) => ({
        ...entry,
        // Assign a color from COLORS array, cycling back to start using modulo (%)
        fill: COLORS[index % COLORS.length]
    }))

    return (
        <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">
                Income by Category
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
                        {/* Format hover values into INR with dark theme styling */}
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc', fontWeight: '500' }}
                        />
                        {/* Display category color keys neatly at the bottom */}
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default IncomeCategoryChart