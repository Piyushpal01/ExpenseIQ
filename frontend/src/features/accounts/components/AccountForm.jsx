// Unified dark-themed form to handle creating new accounts and editing existing ones.

import { useState, useEffect } from "react"
import { useCreateAccount, useUpdateAccount } from "../hooks/useAccounts"
import { accountTypeOptions } from "../utils/accountHelpers"

const accountForm = ({ initialData = null, onSuccess, onCancel }) => {
    // flag to check if form is in add mode or edt mode
    const isEditMode = Boolean(initialData)

    // Initializing API mutation hooks
    const createMutation = useCreateAccount()
    const updateMutation = useUpdateAccount()

    // Initializing component state with empty default values
    const [formData, setFormData] = useState({
        acc_name: '',
        acc_type: 'BANK',
        acc_balance: '',
    })

    // pre-fill form fields if in edit mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                acc_name: initialData.acc_name,
                acc_type: initialData.acc_type,
                acc_balance: initialData.acc_balance,
            })
        }
    }, [initialData])

    // Handler to update state values on input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // form submit logic
    const handleSubmit = (e) => {
        e.preventDefault()

        if (isEditMode) {
            // Update API call
            updateMutation.mutate(
                { id: initialData.id, accountData: formData },
                { onSuccess: () => onSuccess && onSuccess() }
            );
        } else {
            // create API call
            createMutation.mutate(formData,
                { onSuccess: () => onSuccess && onSuccess() }
            );
        }
    }

    // Track global pending state to prevent duplicate submissions
    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEditMode ? 'Edit Account' : 'Add New Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Account Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Account Name</label>
                    <input
                        type="text"
                        name="acc_name"
                        required
                        value={formData.acc_name}
                        onChange={handleChange}
                        placeholder="e.g. HDFC Salary, Pocket Money"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                </div>

                {/* Account Type Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Account Type</label>
                    <select
                        name="acc_type"
                        value={formData.acc_type}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                    >
                        {accountTypeOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Account Balance Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Balance (₹)</label>
                    <input
                        type="number"
                        name="acc_balance"
                        required
                        step="0.01"
                        value={formData.acc_balance}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
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
                        className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            isEditMode ? 'Update Account' : 'Save Account'
                        )}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default accountForm