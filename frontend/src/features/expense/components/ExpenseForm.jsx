// Form for creating / editing expense entriies. Fetches & displays active accounts & expense categories in dropdown

import { useState, useEffect, useMemo } from "react"
import { useCreateExpense, useUpdateExpense } from "../hooks/useExpense"
import { useAccounts } from "../../accounts/hooks/useAccounts"
import { useCategories } from "../../categories/hooks/useCategories"

const ExpenseForm = ({ initialData = null, onSuccess, onCancel }) => {
    const isEditMode = Boolean(initialData)

    // Load mutations 
    const createMutation = useCreateExpense()
    const updateMutation = useUpdateExpense()

    // Fetch data for dropdown
    const { data: accounts = [] } = useAccounts()
    const { data: allCategories = [] } = useCategories()

    // Filter categories having type 'EXPENSE', using useMemo to fix infinite loop of re-rendering
    const expenseCategories = useMemo(() => {
        return allCategories.filter(cat =>
            cat.is_active === true &&
            (cat.category_type || '').toUpperCase() === "EXPENSE"
        )
    }, [allCategories])

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account: '',    // Account id
        category: ''    // Category id
    })

    // Populate form data for Edit Mode(used || operator to avoid uncontrolled input error) else show the form for creating new expense
    useEffect(() => {
        // for edit mode
        if (isEditMode) {
            setFormData({
                amount: initialData.amount || '',
                description: initialData.description || '',
                date: initialData.date || new Date().toISOString().split('T')[0],
                account: initialData.account || '',
                category: initialData.category || '',
            })
        }
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Since amount might come in string from backend, parseFloat it converts into decimal number
        const payload = { ...formData, amount: parseFloat(formData.amount) }

        if (isEditMode) {
            updateMutation.mutate(
                { id: initialData.id, expenseData: payload },
                { onSuccess: () => onSuccess && onSuccess() }
            )
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onSuccess && onSuccess()
            })
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEditMode ? 'Edit Expense' : 'Add Expense'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Field */}
                <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-rose-500 transition-colors"
                />

                {/* Description Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g. Electricity Bill"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                </div>

                {/* Date Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-rose-500 transition-colors scheme-dark"
                    />
                </div>

                {/* Account & Category Row */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Account</label>
                        <select
                            name="account"
                            required
                            value={formData.account}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-rose-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.acc_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-rose-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Category</option>
                            {expenseCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            isEditMode ? 'Update' : 'Save Expense'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm