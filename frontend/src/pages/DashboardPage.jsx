// DahboardPage.jsx => Combining the main layout and components of dashboard

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
import ExpenseCategoryChart from "../features/dashboard/charts/ExpenseCategoryChart"
import IncomeCategoryChart from "../features/dashboard/charts/IncomeCategoryChart"
import IncomeExpenseChart from "../features/dashboard/charts/IncomeExpenseChart"

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

        {/* Charts section */}
        <div className="mt-8 space-y-6 dash-animate">
          {/* Main Bar Chart (Spans full width on large screens) */}
          {data.monthly_chart_data?.length > 0 && (
            <div className="lg:col-span-2">
              <IncomeExpenseChart data={data.monthly_chart_data} />
            </div>
          )}

          {/* Pie Charts Grid */}
          {(data.category_expenses?.length > 0 || data.category_incomes?.length > 0) && (
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <ExpenseCategoryChart data={data.category_expenses} />
              <IncomeCategoryChart data={data.category_incomes} />
            </section>
          )}
        </div>



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