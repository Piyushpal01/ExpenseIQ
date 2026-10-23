import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../features/auth/AuthContext"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.log("__ERROR__ =>", error)
      setError(
        error.response?.data?.detail ||
        'Login failed. Check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-slate-950 text-slate-100">

      {/* LEFT SIDE: SHOWCASE BANNER (Desktop Only) */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-linear-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-12 lg:flex">
        {/* Ambient Glow Orbs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ExpenseIQ</span>
        </div>

        {/* Center Visual Mockup & Metrics */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              alt="ExpenseIQ Financial Analytics"
              className="h-64 w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Floating Glassmorphic Stat Pill */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
              <div>
                <p className="text-xs font-medium text-slate-400">Total Tracked Expenses</p>
                <p className="text-lg font-bold text-white">₹1,42,850 <span className="text-xs font-medium text-emerald-400">↑ 18.2%</span></p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                AI Automated
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Take back control of every rupee.
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Real-time expense categorization, smart monthly projections, and actionable budget insights in one unified dashboard.
            </p>
          </div>
        </div>

        {/* Bottom Social Proof / Testimonial */}
        <div className="relative z-10 border-t border-slate-800/80 pt-6">
          <p className="text-xs italic text-slate-400">
            "ExpenseIQ completely streamlined how I track daily budgets and cloud expenses."
          </p>
        </div>
      </section>

      {/*  RIGHT SIDE: AUTH FORM */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Header */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">ExpenseIQ</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter your credentials to access your ExpenseIQ portal.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors duration-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-colors duration-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                {/* Show password SVG */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all duration-200 hover:bg-emerald-300 hover:shadow-emerald-400/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{loading ? "Signing in..." : "Sign in to account"}</span>
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage