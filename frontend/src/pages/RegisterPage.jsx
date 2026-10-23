import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  // Real-time password health checks
  const passwordCriteria = [
    { label: '8+ characters', met: form.password.length >= 8 },
    { label: 'Contains number', met: /\d/.test(form.password) },
    { label: 'Contains special symbol', met: /[^A-Za-z0-9]/.test(form.password) },
  ]

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully! Please sign in.' },
      })
    } catch (err) {
      const data = err.response?.data
      setError(
        data
          ? Object.entries(data)
              .map(([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`,
              )
              .join(' ')
          : 'Could not create account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      {/* Background Ambient Glow & Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [bg-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Brand Pill */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ExpenseIQ</span>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-7 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Smart finance tracking starts here. Free 30-day analytics included.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400"
            >
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* Name Fields: 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  First Name
                </label>
                <input
                  name="first_name"
                  type="text"
                  required
                  placeholder="Rahul"
                  autoComplete="given-name"
                  value={form.first_name}
                  onChange={updateField}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-150 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Last Name
                </label>
                <input
                  name="last_name"
                  type="text"
                  required
                  placeholder="Sharma"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={updateField}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-150 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="rahul@example.com"
                autoComplete="email"
                value={form.email}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-150 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={updateField}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 outline-none transition duration-150 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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

              {/* Password Rules Checklist */}
              {form.password && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {passwordCriteria.map((criterion, idx) => (
                    <span
                      key={idx}
                      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                        criterion.met
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{criterion.met ? '✓' : '•'}</span>
                      {criterion.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Terms note */}
            <p className="text-xs text-slate-500">
              By clicking "Create account", you agree to our Terms of Service and Privacy Policy.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition-all duration-200 hover:bg-emerald-300 hover:shadow-emerald-400/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span>{loading ? 'Setting up your account...' : 'Create account'}</span>
            </button>
          </form>

          {/* Card Footer */}
          <div className="mt-6 border-t border-slate-800/80 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an ExpenseIQ account?{' '}
              <Link to="/login" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage