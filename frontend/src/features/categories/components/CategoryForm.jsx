// A modal-ready form for creating a new category or updating an existing one.

import { useState, useEffect } from "react"
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories"

const CategoryForm = ({ initialData = null, onSuccess, onCancel }) => {
    // Determine if the form is in edit mode based on initialData
    const isEditMode = Boolean(initialData)

    // Load Mutations
    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()

    // Form state (only name and category_type are required)
    const [formData, setFormData] = useState({ category_name: '', category_type: 'DEFAULT', }) // Default for fallback

    // Pre-Populate form fields if in edit mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                category_name: initialData.category_name || '',
                category_type: initialData.category_type || '',
            })
        }
    }, [initialData])

    // Sync input field with form state
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Trigger create or update API mutation on form submission
    const handleSubmit = (e) => {
        e.preventDefault()

        if (isEditMode) {
            updateMutation.mutate(
                { id: initialData.id, categoryData: formData },
                { onSuccess: () => onSuccess && onSuccess() }
                // first onSuccess is tanstack query's event listener and second onSuccess() is our component prop
            )
        } else {
            createMutation.mutate(formData, { 
                onSuccess: () => onSuccess && onSuccess() 
            })
        }
    }

    // Track combined loading state for both mutations
    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-6">
                {isEditMode ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                    <input
                        type="text"
                        name="category_name"
                        required
                        value={formData.category_name}
                        onChange={handleChange}
                        placeholder="e.g. Groceries, Freelance"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Category Type Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <select
                        name="category_type"
                        value={formData.category_type}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>
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
                            isEditMode ? 'Update' : 'Save'
                        )}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default CategoryForm