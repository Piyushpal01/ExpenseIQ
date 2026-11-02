// DahboardPage.jsx => Combining the main layout and components of dashboard

/* DASHBOARD_DESIGN_PART_ ALL in one UI AND LOGIC */
// import { useRef } from 'react'
// import { useAuth } from '../features/auth/AuthContext'
// import { useNavigate } from 'react-router-dom'
// import { useDashboard } from '../features/dashboard/hooks/useDashboard'
// import gsap from 'gsap'
// import { useGSAP } from '@gsap/react'
// import DashboardStatCard from '../features/dashboard/components/StatCard'

// const currency = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 2,
// })

// function StatCard({ title, amount, description, type = 'default' }) {

//   // Badges - Income, Expense, Net-Balance, Account Balance
//   const getBadgeStyle = () => {
//     switch (type) {
//       case 'income':
//         return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
//       case 'expense':
//         return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
//       case 'net':
//         return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
//       default:
//         return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
//     }
//   }

//   return (
//     <article className="stat-card group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-slate-950/50">
//       <div className="flex items-center justify-between gap-2">
//         <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
//         <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight ${getBadgeStyle()}`}>
//           {type.toUpperCase()}
//         </span>
//       </div>

//       <p className="mt-4 wrap-break-word text-3xl font-extrabold tracking-tight text-white">
//         {currency.format(Number(amount ?? 0))}
//       </p>

//       <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>

//       {/* Subtle border glow on hover */}
//       <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-slate-700/40" />
//     </article>
//   )
// }

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const containerRef = useRef(null)

//   const { data, isPending, isError, error, refetch } = useDashboard()

//   async function handleLogout() {
//     try {
//       await logout()
//     } finally {
//       navigate('/login', { replace: true })
//     }
//   }

//   // Smooth GSAP Entry Animation
//   useGSAP(
//   () => {
//     // Data successfully load hone ke baad hi dashboard animate hoga.
//     if (isPending || isError || !data) return

//     const tl = gsap.timeline({
//       defaults: { ease: 'power3.out' },
//     })

//     // Header upar se smoothly appear hoga.
//     tl.fromTo(
//       '.dash-header',
//       { y: -20, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.6 },
//     )
//       // Stat cards stagger ke saath ek-ek karke appear honge.
//       .fromTo(
//         '.stat-card',
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
//         '-=0.3',
//       )
//       // Neeche ke content panels animate honge.
//       .fromTo(
//         '.content-panel',
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
//         '-=0.2',
//       )
//   },
//   {
//     scope: containerRef,
//     dependencies: [isPending, isError, data],
//     revertOnUpdate: true,
//   },
// )

//   // Polished Skeleton Screen on isPending
//   if (isPending) {
//     return (
//       <main className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
//         <div className="mx-auto max-w-7xl animate-pulse space-y-8">
//           <div className="flex items-center justify-between">
//             <div className="space-y-3">
//               <div className="h-4 w-28 rounded bg-slate-800" />
//               <div className="h-8 w-48 rounded bg-slate-800" />
//             </div>
//             <div className="h-10 w-24 rounded-lg bg-slate-800" />
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-36 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6" />
//             ))}
//           </div>

//           <div className="grid gap-6 lg:grid-cols-2">
//             <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
//             <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
//           </div>
//         </div>
//       </main>
//     )
//   }

//   // Modern Error Screen on isError
//   if (isError) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
//         <div className="max-w-md rounded-2xl border border-rose-500/20 bg-slate-900/80 p-8 text-center backdrop-blur-md shadow-2xl">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
//             <span className="text-2xl font-bold">!</span>
//           </div>
//           <h1 className="mt-5 text-2xl font-bold tracking-tight">Unable to load dashboard</h1>
//           <p className="mt-3 text-sm text-slate-400">
//             {error.response?.data?.detail || 'Please check your connection and try again.'}
//           </p>
//           <button
//             onClick={() => refetch()}
//             className="mt-6 w-full cursor-pointer rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
//           >
//             Retry Connection
//           </button>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main ref={containerRef} className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <header className="dash-header flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
//           <div>
//             <div className="flex items-center gap-2">
//               <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
//               <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
//                 ExpenseIQ
//               </p>
//             </div>
//             <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
//             <p className="mt-1 text-sm font-medium text-slate-400">
//               Welcome back, <span className="text-slate-200">{user?.email || 'User'}</span>
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="cursor-pointer rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
//           >
//             Logout
//           </button>
//         </header>

//         {/* Stats Grid */}
//         <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <DashboardStatCard
//   type="income"
//   title="Total Income"
//   amount={data.total_income}
//   description="Income recorded in ExpenseIQ"
// />
//           <StatCard
//             type="expense"
//             title="Total Expenses"
//             amount={data.total_expense}
//             description="Expenses recorded in ExpenseIQ"
//           />
//           <StatCard
//             type="net"
//             title="Net Balance"
//             amount={data.net_balance}
//             description="Net Balance, which is Income minus Expenses"
//           />
//           <StatCard
//             type="default"
//             title="Account Balance"
//             amount={data.total_account_balance}
//             description="Combined balance of all user accounts"
//           />
//         </section>

//         {/* Details Section */}
//         <section className="mt-8 grid gap-6 lg:grid-cols-2">
//           {/* Your Accounts */}
//           <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
//             <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
//               <h2 className="text-lg font-semibold tracking-tight text-white">Your Accounts</h2>
//               <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
//                 {data.accounts?.length || 0} Total
//               </span>
//             </div>

//             {data.accounts.length === 0 ? (
//               <p className="mt-6 text-sm text-slate-400">No accounts added yet.</p>
//             ) : (
//               <div className="mt-2 divide-y divide-slate-800/60">
//                 {data.accounts.map((account) => (
//                   <div
//                     key={account.id}
//                     className="group flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-slate-800/20"
//                   >
//                     <div>
//                       <p className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
//                         {account.acc_name}
//                       </p>
//                       <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
//                         {account.acc_type.replaceAll('_', ' ')}
//                       </p>
//                     </div>
//                     <p className="font-bold text-slate-100">
//                       {currency.format(Number(account.acc_balance))}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Recent Transactions */}
//           <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
//             <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
//               <h2 className="text-lg font-semibold tracking-tight text-white">Recent Transactions</h2>
//               <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
//                 Latest
//               </span>
//             </div>

//             {data.recent_transactions.length === 0 ? (
//               <p className="mt-6 text-sm text-slate-400">No transactions recorded yet.</p>
//             ) : (
//               <div className="mt-2 divide-y divide-slate-800/60">
//                 {data.recent_transactions.map((transaction) => (
//                   <div
//                     key={`${transaction.type}-${transaction.id}`}
//                     className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-slate-800/20"
//                   >
//                     <div className="min-w-0">
//                       <p className="truncate font-semibold text-slate-200 group-hover:text-white transition-colors">
//                         {transaction.description || transaction.category}
//                       </p>
//                       <div className="mt-1 flex items-center gap-2">
//                         <span className="text-xs text-slate-400 font-medium">
//                           {transaction.category}
//                         </span>
//                         <span className="text-slate-600">•</span>
//                         <span className="text-xs text-slate-500">
//                           {transaction.date}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="shrink-0 text-right">
//                       <p
//                         className={`text-base font-bold tracking-tight ${
//                           transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
//                         }`}
//                       >
//                         {transaction.type === 'income' ? '+' : '-'}
//                         {currency.format(Number(transaction.amount))}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   )
// }


// Final dashboard

import { useRef } from "react"
import { useAuth } from "../features/auth/AuthContext"
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'

import DashboardHeader from '../features/dashboard/components/DashboardHeader'
import FinancialOverview from '../features/dashboard/components/FinancialOverview'
import AccountsOverview from '../features/dashboard/components/AccountsOverview'
import RecentTransactions from '../features/dashboard/components/RecentTransactions'
import DashboardSkeleton from '../features/dashboard/components/DashboardSkeleton'
import DashboardError from '../features/dashboard/components/DashboardError'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const { data, isPending, isError, error, refetch } = useDashboard()

  // Handles logout and redirects the user to the login page.
  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  // Animate dashboard sections only after successful data loading.
  useGSAP(
    () => {
      if (isPending || isError || !data) return

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      // Animate the dashboard header.
      tl.fromTo(
        '.dash-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )

        // Animate financial stat cards with a stagger effect.
        .fromTo(
          '.stat-card',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.3',
        )

        // Animate the remaining dashboard panels.
        .fromTo(
          '.content-panel',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
          '-=0.2',
        )
    },
    {
      scope: containerRef,
      dependencies: [isPending, isError, data],
      revertOnUpdate: true,
    },
  )

  // Display the loading skeleton while dashboard data is being fetched.
  if (isPending) {
    return <DashboardSkeleton />
  }

  // Display an error screen if the dashboard request fails.
  if (isError) {
    return (
      <DashboardError
        error={error}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-slate-950 p-5 text-white sm:p-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Dashboard header and logout action */}
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
        />

        {/* Financial summary cards */}
        <FinancialOverview data={data} />

        {/* Accounts and recent transactions */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <AccountsOverview accounts={data.accounts} />

          <RecentTransactions recent_transactions={data.recent_transactions} />
        </section>
      </div>

    </main>
  )
}

export default DashboardPage