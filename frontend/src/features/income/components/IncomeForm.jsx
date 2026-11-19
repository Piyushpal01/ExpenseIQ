// Form for creating / editing income entriies. Fetches & displays active accounts & income categories in dropdown

import { useState, useEffect, useMemo } from "react"
import { useCreateIncome, useUpdateIncome } from "../hooks/useIncome"
import { useAccounts } from "../../accounts/hooks/useAccounts"
import { useCategories } from "../../categories/hooks/useCategories"

const IncomeForm = ({ initialData = null, onSuccess, onCancel }) => {
    // Fetch data for dropdown
    const { data: accounts = [] } = useAccounts()
    const { data: allCategories = [] } = useCategories()

    // Filter categories having type 'INCOME', using useMemo to fix infinite loop of re-rendering
    const incomeCategories = useMemo(() => {
        return allCategories.filter(cat =>
            cat.is_active === true &&
            (cat.category_type || '').toUpperCase() === "INCOME"
        )
    }, [allCategories])

    const isEditMode = Boolean(initialData)

    // for new user register, having 0 categries & accounts, so ensuring user has created atleast 1 account & category
    // Only block form in Create Mode when accounts/categories are missing
    const hasNoAccounts = accounts.length === 0
    const hasNoCategories = incomeCategories.length === 0
    const isFormBlocked = !isEditMode && (hasNoAccounts || hasNoCategories) // flag to show warning banner & disable form submission

    // Preserve soft-deleted account/category option in Edit Mode so dropdown never breaks
    const isCurrentAccountDeleted = isEditMode && initialData?.account && !accounts.some(acc => acc.id === initialData.account)
    const isCurrentCategoryDeleted = isEditMode && initialData?.category && !incomeCategories.some(cat => cat.id === initialData.category)

    // Load mutations
    const createMutation = useCreateIncome()
    const updateMutation = useUpdateIncome()

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0], // by default current date
        account: '',    // Account id
        category: '',   // Category id
    })

    // Populate form data for Edit Mode(used || operator to avoid uncontrolled input error) else show the form for creating new income
    useEffect(() => {
        // for edit mode
        if (initialData) {
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
            // api call for updating existing income 
            updateMutation.mutate(
                { id: initialData.id, incomeData: payload },
                { onSuccess: () => onSuccess && onSuccess() }
            )
        } else {
            // api call for creating new income
            createMutation.mutate(payload, {
                onSuccess: () => onSuccess && onSuccess()
            })
        }
    }

    const isLoading = createMutation.isPending || updateMutation.isPending
   
    // For rendering Error messages
    // Combine error states from both create and update mutations into a single source
    const mutationError = createMutation.error || updateMutation.error

    const getErrorMessage = (err) => {
        // if no error present
        if (!err) return null

        // Extract response payload(handles n/w errors where response is undefined)
        const data = err?.response?.data
        if (!data) return "Something went wrong. Please try again."

        // case 1: if backend returns plain text/html string(e.g. 500 server error)
        if (typeof data === "string") return data

        // case 2: standard drf general error format (e.g.{'detail':'not found'})
        if (data.detail) return data.detail
        
        // case 3: for DRF Field-Level validation error (e.g.{amount:["Insuffiecient balance..."]})
        const firstKey = Object.keys(data)[0]
        if (firstKey) {
            const val = data[firstKey]
            // since drf wraps field errors in an array, extract the first msg
            return Array.isArray(val) ? val[0] : String(val)
        }

        // Fallback message if error structure is unrecognized
        return "Please check your inputs and try again."
    }

    // Final formatted error for rendering in UI
    const apiErrorMessage = getErrorMessage(mutationError)


    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEditMode ? 'Edit Income' : 'Add Income'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Warning Banner: Shown when prerequisite accounts or categories are missing */}
                {isFormBlocked && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                        {hasNoAccounts && hasNoCategories
                            ? "Create at least one Account and Category first before adding a record."
                            : hasNoAccounts
                                ? "Create at least one active Account first."
                                : "Create at least one active Category first."}
                    </div>
                )}

                {/* API Error Banner for backend validation errors (e.g. negative balance on edit) */}
                {apiErrorMessage && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                        {apiErrorMessage}
                    </div>
                )}

                {/* Amount Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        step="0.01"
                        min="0.01"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g. November Salary"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
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
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors scheme-dark"
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
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Account</option>
                            {/* Show current soft-deleted account in Edit Mode */}
                            {isCurrentAccountDeleted && (
                                <option value={initialData.account}>
                                    {initialData.account_name} (Deleted)
                                </option>
                            )}
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
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Category</option>
                            {/* Show current soft-deleted category in Edit Mode */}
                            {isCurrentCategoryDeleted && (
                                <option value={initialData.category}>
                                    {initialData.category_name} (Deleted)
                                </option>
                            )}
                            {incomeCategories.map(cat => (
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
                        disabled={isLoading || isFormBlocked}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            isEditMode ? 'Update' : 'Save Income'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default IncomeForm;