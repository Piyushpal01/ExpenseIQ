// Main page for expense management.
// Displays total expense, list of expense records & handles edit / delete modal

import { useState, useEffect, useRef } from "react"
import { useExpense } from "../features/expense/hooks/useExpense"
// import { useAccounts } from "../features/accounts/hooks/useAccounts"
// import { useCategories } from "../features/categories/hooks/useCategories"
import ExpenseList from "../features/expense/components/ExpenseList"
import ExpenseForm from "../features/expense/components/ExpenseForm"
import Modal from "../components/ui/Modal"
import gsap from "gsap"

const ExpensePage = () => {
    // API fetch
    const { data: rawExpenses = [], isPending, isError, error, refetch } = useExpense()
    // const { data: accounts = [] } = useAccounts()
    // const { data: userCategories = [] } = useCategories()

    // Filter to ONLY use EXPENSE categories for this page's mapping
    // const expenseCategories = userCategories.filter(cat =>
    //     (cat.category_type || '').toUpperCase() === "EXPENSE"
    // )

    const pageRef = useRef()

    // Modal & Form states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)

    const validExpenses = Array.isArray(rawExpenses) ? rawExpenses : []

    // Mapping account and category IDs to their respective names
    // const enrichedExpenses = validExpenses.map(expense => {
    //     const accountMatch = accounts.find(acc => String(acc.id) === String(expense.account))
    //     const categoryMatch = expenseCategories.find(cat => String(cat.id) === String(expense.category))

    //     // binding account name and category name in expense record for displaying in card
    //     return {
    //         ...expense,
    //         account_name: accountMatch ? accountMatch.acc_name : 'Unknown Account',
    //         category_name: categoryMatch ? categoryMatch.category_name : 'Unknown Category',
    //     }
    // })
    // Calculate total expense amount
    // const totalExpense = enrichedExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)

    const totalExpense = validExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)

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
        <main ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-5xl">

                {/* Header & stats section */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 header-animate">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-red-400">
                            Expenses
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Track all your outgoing cash flows and spending.
                        </p>
                    </div>

                    {!isPending && !isError && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 min-w-50 flex items-center justify-between backdrop-blur-md">
                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Total Expense</p>
                                <p className="text-2xl font-bold text-rose-400">₹{totalExpense.toFixed(2)}</p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbar: Add Button */}
                <div className="mb-6 flex justify-end header-animate">
                    <button
                        onClick={openModalForCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 px-5 py-2.5 rounded-xl font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                        Add Expense
                    </button>
                </div>

                {/* Expense List Component */}
                <div className="mt-6">
                    <ExpenseList
                        expenses={validExpenses}
                        isPending={isPending}
                        isError={isError}
                        error={error}
                        onEdit={handleEdit}
                        refetch={refetch}
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