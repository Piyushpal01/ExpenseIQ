// Main page for expense management.
// Displays total expense, server-side search/filter utility panel, and expense records list

import { useState, useEffect, useRef, useCallback } from "react"
import { useExpense } from "../features/expense/hooks/useExpense"
import ExpenseList from "../features/expense/components/ExpenseList"
import ExpenseForm from "../features/expense/components/ExpenseForm"
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

const ExpensePage = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS)
    const { data: rawExpenses = [], isPending, isFetching, isError, error, refetch } = useExpense(filters) // API fetch
    const pageRef = useRef()

    // Modal & Form states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)

    const validExpenses = Array.isArray(rawExpenses) ? rawExpenses : []

    const totalExpense = validExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)

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

    // 2. List Stagger Animation
    useEffect(() => {
        if (!isPending && validExpenses.length > 0) {
            const ctx = gsap.context(() => {
                setTimeout(() => {
                    const cards = document.querySelectorAll('.expense-card-wrapper')
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
    }, [isPending, validExpenses.length])

    const openModalForCreate = () => {
        setIsModalOpen(true)
        setEditingExpense(null)
    }

    const handleEdit = (expense) => {
        setEditingExpense(expense)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
            setEditingExpense(null)
        }, 300);
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
                                    ? "Filtered Expense Total"
                                    : "Total Expense"}
                            </p>
                            <p className="text-2xl font-bold text-rose-400">₹{totalExpense.toFixed(2)}</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                        </div>
                    </div>
                ) : <div />}

                <button
                    onClick={openModalForCreate}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-5 py-3 rounded-xl font-medium transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add Expense
                </button>
            </div>

            {/* 2-Column Split: Transactions List (Left) + Utility Filters Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                <section className={`lg:col-span-8 order-2 lg:order-1 transition-opacity duration-200 ${isFetching ? "opacity-70" : "opacity-100"}`}>
                    <ExpenseList
                        expenses={validExpenses}
                        isPending={isPending}
                        isError={isError}
                        error={error}
                        onEdit={handleEdit}
                        refetch={refetch}
                    />
                </section>

                <div className="lg:col-span-4 order-1 lg:order-2">
                    <TransactionFilters
                        type="expense"
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        isFetching={isFetching}
                    />
                </div>
            </div>

            {/* Reusable Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ExpenseForm
                    initialData={editingExpense}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </main>
    )
}

export default ExpensePage