// AppLayout.jsx => Shared authenticated shell with branding, center-pop floating glassmorphism navbar, and logout

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'

const NAV_ITEMS = [
    { label: 'Dashboard', to: '/dashboard', subtitle: 'Your complete financial overview and cashflow analytics.' },
    { label: 'Accounts', to: '/accounts', subtitle: 'Manage your bank accounts, wallets, and credit cards.' },
    { label: 'Categories', to: '/categories', subtitle: 'Organize your income and expense classifications.' },
    { label: 'Income', to: '/income', subtitle: 'Track all your earning sources and incoming cash flows.' },
    { label: 'Expense', to: '/expense', subtitle: 'Track all your outgoing cash flows and spending.' },
]

const AppLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const linkRefs = useRef({})
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
    const [isScrolled, setIsScrolled] = useState(false)

    const activeItem = NAV_ITEMS.find((item) => item.to === location.pathname) || NAV_ITEMS[0]

    const movePillTo = (path) => {
        const el = linkRefs.current[path]
        if (!el) return
        setPillStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
            opacity: 1,
        })
    }

    // Track scroll position to detach and float the pill navbar at top
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Recalculate glowing pill position on route change, resize, or floating state change
    useEffect(() => {
        const updateActivePill = () => movePillTo(location.pathname)
        updateActivePill()
        // Re-measure right after width transition settles
        const timer = setTimeout(updateActivePill, 150)
        window.addEventListener('resize', updateActivePill)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', updateActivePill)
        }
    }, [location.pathname, isScrolled])

    const handleLogout = async () => {
        try {
            await logout()
        } finally {
            navigate('/login', { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Shared Top Navigation Header */}
            <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
                    {/* LEFT: Branding & Active Page Context */}
                    <div className="order-1">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                                ExpenseIQ
                            </p>
                        </div>

                        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                            {activeItem.label}
                        </h1>

                        <p className="mt-0.5 text-xs font-medium text-slate-400 sm:text-sm">
                            {location.pathname === '/dashboard' ? (
                                <>
                                    Welcome back,{' '}
                                    <span className="text-slate-200">
                                        {user?.first_name || user?.email || 'User'}
                                    </span>
                                </>
                            ) : (
                                activeItem.subtitle
                            )}
                        </p>
                    </div>

                    {/* CENTER: Animated Glassmorphism Pill Navbar (Center Pop-Out & Wide on Scroll) */}
                    <div className="order-3 w-full lg:order-2 lg:w-auto">
                        {/* Invisible placeholder to prevent layout jump when navbar detaches */}
                        {isScrolled && <div className="h-13 w-full lg:w-115" aria-hidden="true" />}

                        <div
                            className={
                                isScrolled
                                    ? 'fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none'
                                    : 'w-full lg:w-auto'
                            }
                        >
                            <nav
                                aria-label="Primary navigation"
                                onMouseLeave={() => movePillTo(location.pathname)}
                                className={`pointer-events-auto ${isScrolled
                                        ? 'w-full max-w-3xl animate-[centerPopOut_0.28s_cubic-bezier(0.16,1,0.3,1)_forwards]'
                                        : 'relative w-full lg:w-auto'
                                    }`}
                            >
                                <div
                                    className={`relative flex flex-wrap items-center rounded-2xl border p-1.5 backdrop-blur-xl transition-all duration-300 ${isScrolled
                                            ? 'justify-between sm:justify-around gap-2 border-white/15 bg-slate-900/85 px-3 py-2 shadow-[0_14px_45px_rgba(0,0,0,0.8),0_0_28px_rgba(139,92,246,0.22)]'
                                            : 'justify-center gap-1 border-white/10 bg-slate-900/55 shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
                                        }`}
                                >
                                    {/* Sliding Glowing Glass Pill */}
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            transform: `translateX(${pillStyle.left}px)`,
                                            width: `${pillStyle.width}px`,
                                            opacity: pillStyle.opacity,
                                        }}
                                        className="pointer-events-none absolute top-1.5 left-0 h-[calc(100%-12px)] rounded-xl border border-violet-400/30 bg-linear-to-r from-violet-500/25 via-fuchsia-500/15 to-emerald-500/25 shadow-[0_0_20px_rgba(139,92,246,0.28)] transition-all duration-300 ease-out"
                                    />

                                    {NAV_ITEMS.map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            ref={(el) => {
                                                linkRefs.current[item.to] = el
                                            }}
                                            onMouseEnter={() => movePillTo(item.to)}
                                            className={({ isActive }) =>
                                                `relative z-10 rounded-xl font-medium tracking-wide transition-all duration-200 ${isScrolled
                                                    ? 'px-4 py-2 text-xs sm:px-6 sm:text-sm'
                                                    : 'px-3.5 py-2 text-xs sm:px-4 sm:text-sm'
                                                } ${isActive
                                                    ? 'text-white'
                                                    : 'text-slate-400 hover:text-slate-100'
                                                }`
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* RIGHT: Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="order-2 lg:order-3 group flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-md transition-all duration-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
                    >
                        <svg
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>
            {/* 👇 YAHAN ADD KARNA HAI (</header> ke baad aur <Outlet /> se pehle) */}
            <style>{`
                @keyframes centerPopOut {
                    0% {
                        opacity: 0;
                        transform: translateY(-12px) scale(0.92);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>

            {/* Active Route Content Renders Here */}
            <Outlet />
        </div>
    )
}
export default AppLayout