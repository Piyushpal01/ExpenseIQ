// Main page for income management.
// Displays total income, server-side search/filter utility panel, and income records list

import { useState, useEffect, useRef, useCallback } from "react"
import { useIncome } from "../features/income/hooks/useIncome"
import IncomeList from "../features/income/components/IncomeList"
import IncomeForm from "../features/income/components/IncomeForm"
import TransactionFilters from "../components/ui/TransactionFilters"
import Modal from "../components/ui/Modal"
import gsap from "gsap"

const INITIAL_FILTERS = {
    search: "",
    account: "",
    category: "",
    date: "",
    ordering: "-date,-created_at",
}

const IncomePage = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const { data: rawIncomes = [], isPending, isFetching, isError, error, refetch } = useIncome(filters)   // API fetch
    const pageRef = useRef()

    // Modal & form states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingIncome, setEditingIncome] = useState(null)

    const validIncomes = Array.isArray(rawIncomes) ? rawIncomes : []

    const totalIncome = validIncomes.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0)

    // Method to handler filter change
    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    // Method to reset filters
    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS)
    }, [])

    // 1. Initial page loading animation for headers & toolbar
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-animate',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            )
        }, pageRef)
        return () => ctx.revert()
    }, [])

    // 2. List Stagger Animation (After data is fetched and rendered)
    useEffect(() => {
        if (!isPending && validIncomes.length > 0) {
            const ctx = gsap.context(() => {
                setTimeout(() => {
                    const cards = document.querySelectorAll('.income-card-wrapper')
                    if (cards.length > 0) {
                        gsap.fromTo(cards,
                            { y: 30, opacity: 0, scale: 0.95 },
                            { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' }
                        )
                    }
                }, 50)
            }, pageRef)
            return () => ctx.revert()
        }
    }, [isPending, validIncomes.length])

    // Modal form pop up for add income, here form will open, but no in edit mode, so initial data that will be sent to income form will be null
    const openModalForCreate = () => {
        setEditingIncome(null)
        setIsModalOpen(true)
    }

    // Edit form handler
    const handleEdit = (income) => {
        setEditingIncome(income)
        setIsModalOpen(true)
    }

    // Close modal form hadnler
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
            setEditingIncome(null)
        }, 300) // clear state after exit animation
    }

    return (
        <main ref={pageRef} className="mx-auto max-w-7xl px-4 py-6 text-white sm:px-8 font-sans">
            {/* Top Summary & Add Button Bar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 header-animate">
                {!isPending && !isError ? (
                    <div className="bg-slate-900/55 border border-slate-800/80 rounded-2xl p-4 min-w-60 flex items-center justify-between backdrop-blur-md">
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">
                                {filters.search || filters.account || filters.category || filters.date
                                    ? "Filtered Income Total"
                                    : "Total Income"}
                            </p>
                            <p className="text-2xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>
                ) : <div />}

                <button
                    onClick={openModalForCreate}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-5 py-3 rounded-xl font-medium transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add Income
                </button>
            </div>

            {/* 2-Column Split: Transactions List (Left) + Utility Filters Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                <section className={`lg:col-span-8 order-2 lg:order-1 transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}>
                    <IncomeList
                        incomes={validIncomes}
                        isPending={isPending}
                        isError={isError}
                        error={error}
                        onEdit={handleEdit}
                        refetch={refetch}
                    />
                </section>

                <div className="lg:col-span-4 order-1 lg:order-2">
                    <TransactionFilters
                        type="income"
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        isFetching={isFetching}
                    />
                </div>
            </div>

            {/* Reusable Modal containing the Form */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <IncomeForm
                    initialData={editingIncome}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </main>
    )
}

export default IncomePage