// Main page for income management.
// Displays total income, list of income records & handles edit / delete modal

import { useState, useEffect, useRef } from "react"
import { useIncome } from "../features/income/hooks/useIncome"
import { useAccounts } from "../features/accounts/hooks/useAccounts"
import { useCategories } from "../features/categories/hooks/useCategories"
import IncomeList from "../features/income/components/IncomeList"
import IncomeForm from "../features/income/components/IncomeForm"
import Modal from "../components/ui/Modal"
import gsap from "gsap"

const IncomePage = () => {
    // API fetch - income, accounts, categories
    const { data: rawIncomes = [], isPending, isError, error, refetch } = useIncome()
    const { data: accounts = [] } = useAccounts()
    const { data: userCategories = [] } = useCategories()

    // Filter to ONLY use INCOME categories for this page's mapping
    const incomeCategories = userCategories.filter(cat => 
        (cat.category_type || '').toUpperCase() === "INCOME"
    )

    const pageRef = useRef()

    // Modal & form states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingIncome, setEditingIncome] = useState(null)

    const validIncomes = Array.isArray(rawIncomes) ? rawIncomes : []    

    // Mapping account name, category name with strict type coercion just in case as in income we receive only id so using that we are mapping that id account name and category and date also.
    const enrichedIncomes = validIncomes.map(income => {
        // Use String() to ensure '7' (string) and 7 (number) match correctly
        const accountMatch = accounts.find(acc => acc.id === income.account)
        const categoryMatch = incomeCategories.find(cat => cat.id === income.category)

        return {
            ...income, 
            account_name: accountMatch ? accountMatch.acc_name : 'Unknown Account',
            category_name: categoryMatch ? categoryMatch.category_name : 'Unknown Category',
        }
    })


    // Calculate toal income using enriched data 
    const totalIncome = enrichedIncomes.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0)

    // 1. Initial page loading animation for headers & toolbar
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.header-animate',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            )
        }, pageRef);
        return () => ctx.revert()
    }, [])

    // 2. List Stagger Animation (After data is fetched and rendered)
    useEffect(() => {
        if (!isPending && enrichedIncomes.length > 0) {
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
    }, [isPending, enrichedIncomes.length])

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
        <main ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-5xl">

                {/* Header & stats section */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 header-animate">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
                            Income
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Track all your earning sources and incoming cash flows.
                        </p>
                    </div>

                    {!isPending && !isError && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 min-w-50 flex items-center justify-between backdrop-blur-md">
                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Total Income</p>
                                <p className="text-2xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</p>
                            </div>
                            
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toolbar: Add Button */}
                <div className="mb-6 flex justify-end header-animate">
                    <button
                        onClick={openModalForCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-medium transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Income
                    </button>
                </div>

                {/* Income List Component */}
                <div className="mt-6">
                    <IncomeList
                        incomes={enrichedIncomes}
                        isPending={isPending}
                        isError={isError}
                        error={error}
                        onEdit={handleEdit}
                        refetch={refetch}
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