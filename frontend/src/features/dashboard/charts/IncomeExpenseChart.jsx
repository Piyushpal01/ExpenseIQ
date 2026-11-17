// IncomeExpenseChart.jsx => Displays a grouped comparison of monthly income vs. expenses over time

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../utils/formatCurrency'

const IncomeExpenseChart = ({ data = [] }) => {
    if(!data || data.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 text-sm text-slate-400">
                No monthly data available yet.
            </div>
        )
    }

    return (
        <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col h-full">
            <div className="mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-white">Cash Flow Trend</h2>
                <p className="text-xs text-slate-400 mt-1">Monthly Income vs Expense comparison</p>
            </div>
            
            {/* Bar Chart */}
            <div className="h-72 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                            itemStyle={{ fontWeight: '500' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} iconType="circle" />
                        
                        {/* Green Bar for Income, Red Bar for Expense */}
                        <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default IncomeExpenseChart