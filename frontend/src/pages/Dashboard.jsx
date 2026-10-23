// DASHBOARD_DESIGN_PART_1
// import { useState } from 'react'
// import { useAuth } from '../features/auth/AuthContext'

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   const [loggingOut, setLoggingOut] = useState(false)

//   async function handleLogout() {
//     setLoggingOut(true)
//     try {
//       await logout()
//     } finally {
//       setLoggingOut(false)
//     }
//   }

//   // Placeholder initial stats (Django API hook up hote hi replace ho jayenge)
//   const stats = [
//     {
//       label: 'Total Balance',
//       value: '₹2,45,820',
//       change: '+12.4%',
//       isPositive: true,
//       subtext: 'vs last month',
//     },
//     {
//       label: 'Monthly Expenses',
//       value: '₹34,180',
//       change: '-4.8%',
//       isPositive: true,
//       subtext: 'lower than budget',
//     },
//     {
//       label: 'Monthly Savings',
//       value: '₹41,200',
//       change: '+18.2%',
//       isPositive: true,
//       subtext: 'saving rate ~54%',
//     },
//   ]

//   const recentTransactions = [
//     {
//       id: 1,
//       title: 'AWS Cloud Hosting',
//       category: 'Software & Dev',
//       amount: -3200,
//       date: 'Today, 2:40 PM',
//       icon: '💻',
//     },
//     {
//       id: 2,
//       title: 'Client Payment (Freelance)',
//       category: 'Income',
//       amount: 45000,
//       date: 'Yesterday',
//       icon: '💼',
//     },
//     {
//       id: 3,
//       title: 'Blue Tokai Coffee & Lunch',
//       category: 'Food & Dining',
//       amount: -650,
//       date: '09 Oct, 2026',
//       icon: '☕',
//     },
//     {
//       id: 4,
//       title: 'Uber Commute',
//       category: 'Travel',
//       amount: -420,
//       date: '08 Oct, 2026',
//       icon: '🚕',
//     },
//   ]

//   return (
//     <main className="min-h-screen bg-slate-950 text-slate-100">
//       {/* ================= Top Navigation Bar ================= */}
//       <nav className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20">
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//             <span className="text-lg font-bold tracking-tight text-white">ExpenseIQ</span>
//           </div>

//           {/* User profile & action */}
//           <div className="flex items-center gap-3 sm:gap-4">
//             <div className="hidden items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 py-1.5 pl-2 pr-3.5 sm:flex">
//               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
//                 {user?.email ? user.email[0].toUpperCase() : 'U'}
//               </div>
//               <span className="max-w-[160px] truncate text-xs font-medium text-slate-300">
//                 {user?.email}
//               </span>
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
//             </div>

//             <button
//               onClick={handleLogout}
//               disabled={loggingOut}
//               className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
//             >
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               <span>{loggingOut ? 'Signing out...' : 'Logout'}</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ================= Main Container ================= */}
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
//         {/* Welcome Header & Action Buttons */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
//               Financial Overview
//             </h1>
//             <p className="mt-1 text-sm text-slate-400">
//               Track live expenses, pending balances, and AI budget projections.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-850 hover:border-slate-700">
//               <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//               Export
//             </button>

//             <button className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-400/20 transition-all hover:bg-emerald-300 active:scale-[0.99]">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//               </svg>
//               Add Expense
//             </button>
//           </div>
//         </div>

//         {/* ================= Metric Cards ================= */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {stats.map((stat, idx) => (
//             <div
//               key={idx}
//               className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-slate-700"
//             >
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                   {stat.label}
//                 </span>
//                 <span
//                   className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${
//                     stat.isPositive
//                       ? 'bg-emerald-500/10 text-emerald-400'
//                       : 'bg-rose-500/10 text-rose-400'
//                   }`}
//                 >
//                   {stat.change}
//                 </span>
//               </div>
//               <p className="mt-4 text-3xl font-extrabold text-white tracking-tight">
//                 {stat.value}
//               </p>
//               <p className="mt-1 text-xs text-slate-500">
//                 {stat.subtext}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ================= 2-Column Split: Progress & Transactions ================= */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* Left Column: Monthly Budget Progress */}
//           <div className="space-y-6 lg:col-span-1">
//             <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl">
//               <h2 className="text-base font-bold text-white">Monthly Target</h2>
//               <p className="mt-0.5 text-xs text-slate-400">Budget limit: ₹50,000 / mo</p>

//               <div className="mt-6 space-y-2">
//                 <div className="flex justify-between text-xs font-medium">
//                   <span className="text-slate-300">Spent (68%)</span>
//                   <span className="text-emerald-400">₹15,820 remaining</span>
//                 </div>
//                 {/* Progress bar */}
//                 <div className="h-2.5 w-full rounded-full bg-slate-850 overflow-hidden">
//                   <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 w-[68%]" />
//                 </div>
//               </div>

//               <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
//                 <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
//                   <span>💡 Smart Tip</span>
//                 </div>
//                 <p className="mt-1 text-xs leading-relaxed text-slate-400">
//                   Dining out was 12% lower this week. You are on track to save an extra ₹3,500 by month-end.
//                 </p>
//               </div>
//             </div>

//             {/* Quick Status / Backend State */}
//             <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl">
//               <div className="flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-emerald-400" />
//                 <h3 className="text-sm font-semibold text-white">Django REST API</h3>
//               </div>
//               <p className="mt-2 text-xs leading-relaxed text-slate-400">
//                 JWT Auth session active for <span className="text-slate-300 font-mono">{user?.email}</span>. Ready to connect your transaction endpoints.
//               </p>
//             </div>
//           </div>

//           {/* Right Column: Transactions Feed */}
//           <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl lg:col-span-2">
//             <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
//               <div>
//                 <h2 className="text-base font-bold text-white">Recent Transactions</h2>
//                 <p className="text-xs text-slate-400">Latest activity on your linked accounts</p>
//               </div>
//               <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
//                 View all
//               </button>
//             </div>

//             <div className="mt-4 divide-y divide-slate-800/50">
//               {recentTransactions.map((tx) => (
//                 <div key={tx.id} className="flex items-center justify-between py-3.5 transition-colors hover:bg-slate-850/30 -mx-2 px-2 rounded-xl">
//                   <div className="flex items-center gap-3.5">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-850 bg-slate-950 text-base">
//                       {tx.icon}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-200">{tx.title}</p>
//                       <p className="text-xs text-slate-500">{tx.category} • {tx.date}</p>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <p
//                       className={`text-sm font-bold ${
//                         tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
//                       }`}
//                     >
//                       {tx.amount > 0
//                         ? `+₹${tx.amount.toLocaleString()}`
//                         : `-₹${Math.abs(tx.amount).toLocaleString()}`}
//                     </p>
//                     <span className="text-[11px] text-slate-500">Completed</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

  /* DASHBOARD_DESIGN_PART_2 , 1 & 2 are without logic just UI
  // if everythig is fine, display dashboard
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between">
        <div>
          <p className="text-sm text-emerald-400">EXPENSEIQ</p>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Welcome, {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <section className="mx-auto mt-10 max-w-5xl rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Your finances, in one place</h2>
        <p className="mt-2 text-slate-400">
          Authentication is connected. Next we will load real dashboard data
          from Django.
        </p>
      </section>
    </main>
  )
  */


/* DASHBOARD_DESIGN_PART_3 WITH LOGIC
import { useAuth } from '../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../features/dashboard/useDashboard'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function StatCard({title, amount, description}) {
  return (
    <article className='rounded-2xl border border-slate-800 bg-slate-900 p-5'>
      <p className='text-sm text-slate-400'>{title}</p>
      <p className='mt-3 wrap-break-word text-2xl font-bold'>
        {currency.format(Number(amount ?? 0))}
      </p>
      <p className='mt-2 text-xs text-slate-500'>{description}</p>
    </article>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data, isPending, isError, error, refetch } = useDashboard()
  
  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  // if data is still fetching, in isPending state
  if(isPending) {
    return (
      <main className='min-h-screen bg-slate-950 p-8 text-white'>
        <p className='text-slate-300'>Loadig your financial dashboard</p>
      </main>
    )
  }

  // if data can't be fetched, in isError state
  if(isError) {
    return (
      <main className='min-h-screen bg-slate-950 p-8 text-white'>
        <h1 className='text-2xl font-bold'>Unable to load dashboard</h1>
        <p className='mt-3 text-slate-400'>
          {console.log(error)}
          {error.response?.data?.detail || 'Please check your connection and try again.'}
        </p>
        <button onClick={() => refetch()} className='mt-5 rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950'>
          Retry
        </button>
      </main>
    )
  }
  
  // if everything works fine, display dashboard
  return (
    <main className='min-h-screen bg-slate-950 p-5 text-white sm:p-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold tracking-widest text-emerald-400'>
              ExpenseIQ
            </p>
            <h1 className='mt-2 text-3xl font-bold'>Dashboard</h1>
            <p className='mt-2 text-slate-300 font-semibold'>
              Welcome, {user?.email || 'back'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className='rounded-lg cursor-pointer border border-slate-700 px-4 py-2 hover:bg-slate-800'
          >
            Logout
          </button>
        </header>

        <section className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard 
            title="Total Income"
            amount={data.total_income}
            description="Income recorded in ExpenseIQ"
          />
          <StatCard 
            title="Total Expenses"
            amount={data.total_expense}
            description="Expenses recorded in ExpenseIQ"
          />
          <StatCard 
            title="Net Balance"
            amount={data.net_balance}
            description="Net Balance, which is Income minus Expenses"
          />
          <StatCard 
            title="Account Balance"
            amount={data.total_account_balance}
            description="Total available balance in Account, Combined balance of all user Accounts"
          />
        </section>

        <section className='mt-8 grid gap-6 lg:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold'>Your Accounts</h2>

            {data.accounts.length === 0 ? 
            (
              <p className='mt-5 text-sm text-slate-400'>
                No accoutns added yet.
              </p>
            ) : (
              <div className='mt-4 divide-y divide-slate-800'>
                {data.accounts.map((account) => (
                  <div 
                    key={account.id} 
                    className='flex flex-wrap items-center justify-between gap-3 py-4'
                  >
                    <div>
                      <p className='font-medium'>{account.acc_name}</p>
                      <p className='mt-1 text-sm text-slate-400'>
                        {account.acc_type.replaceAll('_', ' ')}
                      </p>
                    </div>
                    <p className='font-semibold'>{currency.format(Number(account.acc_balance))}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className='rounded-2xl border border-slate-800 bg-slate-900 p-5'>
            <h2 className='text-xl font-semibold'>Recent Transactions</h2>

            {data.recent_transactions.length === 0 ? 
            (
              <p className='mt-5 text-sm text-slate-400'>
                No transactions recorded yet.
              </p>
            ) : (
              <div className='mt-4 divide-y divide-slate-800'>
                {data.recent_transactions.map((transaction) => (
                  <div 
                    key={`${transaction.type}-${transaction.id}`}
                    className='flex items-center justify-between gap-4 py-4 '
                  >
                    <div className='min-w-0'>
                      <p className='truncate font-medium'>
                        {transaction.description || transaction.category}
                      </p>
                      <p className='mt-1 text-sm text-slate-400'>
                        {transaction.category} - {transaction.amount}
                      </p>
                      <p className='mt-1 text-xs text-slate-500'>
                        {transaction.date}
                      </p>
                    </div>

                    <p
                      className={`shrink-0 font-semibold ${
                        transaction.type === 'income' ?'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {currency.format(Number(transaction.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
      </div>
    </main>
  )
}
*/

/* DASHBOARD_DESIGN_PART_4 WITH BETTER UI AND SAME LOGIC */
import { useRef } from 'react'
import { useAuth } from '../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../features/dashboard/useDashboard'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function StatCard({ title, amount, description, type = 'default' }) {

  // Badges - Income, Expense, Net-Balance, Account Balance
  const getBadgeStyle = () => {
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
  
  return (
    <article className="stat-card group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-slate-950/50">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight ${getBadgeStyle()}`}>
          {type.toUpperCase()}
        </span>
      </div>

      <p className="mt-4 wrap-break-word text-3xl font-extrabold tracking-tight text-white">
        {currency.format(Number(amount ?? 0))}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
      
      {/* Subtle border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-slate-700/40" />
    </article>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const { data, isPending, isError, error, refetch } = useDashboard()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  // Smooth GSAP Entry Animation
  useGSAP(
  () => {
    // Data successfully load hone ke baad hi dashboard animate hoga.
    if (isPending || isError || !data) return

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    })

    // Header upar se smoothly appear hoga.
    tl.fromTo(
      '.dash-header',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
    )
      // Stat cards stagger ke saath ek-ek karke appear honge.
      .fromTo(
        '.stat-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        '-=0.3',
      )
      // Neeche ke content panels animate honge.
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

  // Polished Skeleton Screen on isPending
  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded bg-slate-800" />
              <div className="h-8 w-48 rounded bg-slate-800" />
            </div>
            <div className="h-10 w-24 rounded-lg bg-slate-800" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6" />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
            <div className="h-80 rounded-2xl border border-slate-800/80 bg-slate-900/40" />
          </div>
        </div>
      </main>
    )
  }

  // Modern Error Screen on isError
  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="max-w-md rounded-2xl border border-rose-500/20 bg-slate-900/80 p-8 text-center backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Unable to load dashboard</h1>
          <p className="mt-3 text-sm text-slate-400">
            {error.response?.data?.detail || 'Please check your connection and try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 w-full cursor-pointer rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
          >
            Retry Connection
          </button>
        </div>
      </main>
    )
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="dash-header flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                ExpenseIQ
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Welcome back, <span className="text-slate-200">{user?.email || 'User'}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
          >
            Logout
          </button>
        </header>

        {/* Stats Grid */}
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

        {/* Details Section */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Your Accounts */}
          <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-white">Your Accounts</h2>
              <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
                {data.accounts?.length || 0} Total
              </span>
            </div>

            {data.accounts.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">No accounts added yet.</p>
            ) : (
              <div className="mt-2 divide-y divide-slate-800/60">
                {data.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="group flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-slate-800/20"
                  >
                    <div>
                      <p className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {account.acc_name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                        {account.acc_type.replaceAll('_', ' ')}
                      </p>
                    </div>
                    <p className="font-bold text-slate-100">
                      {currency.format(Number(account.acc_balance))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="content-panel rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h2 className="text-lg font-semibold tracking-tight text-white">Recent Transactions</h2>
              <span className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400">
                Latest
              </span>
            </div>

            {data.recent_transactions.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">No transactions recorded yet.</p>
            ) : (
              <div className="mt-2 divide-y divide-slate-800/60">
                {data.recent_transactions.map((transaction) => (
                  <div
                    key={`${transaction.type}-${transaction.id}`}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-slate-800/20"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {transaction.description || transaction.category}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">
                          {transaction.category}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {transaction.date}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-base font-bold tracking-tight ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {currency.format(Number(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}