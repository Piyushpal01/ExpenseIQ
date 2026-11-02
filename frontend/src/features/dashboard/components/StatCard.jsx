// StatCard.jsx => Creating reusable cards for income, expenses, and cash flow for dashboard

import { formatCurrency } from "../utils/formatCurrency"

// Badges - Income, Expense, Net-Balance, Account Balance
function getBadgeStyle(type) {
    switch (type) {
        case 'income':
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        case 'expense':
            return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
        case 'net':
            return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
        default:
            return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    }
}

import React from 'react'

const StatCard = ({ title, amount, description, type = 'default', }) => {
    return (
        <article className="stat-card group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-slate-950/50">
            {/* Card header - title & badge */}
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {title}
                </p>

                <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight ${getBadgeStyle(type)}`}
                >
                    {type.toUpperCase()}
                </span>
            </div>

            {/* main - amount with INR currency */}
            <p className="mt-4 wrap-break-word text-3xl font-extrabold tracking-tight text-white">
                {formatCurrency(amount)}
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {description}
            </p>

            {/* Subtle border glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-slate-700/40" />
        </article>
    )
}

export default StatCard
