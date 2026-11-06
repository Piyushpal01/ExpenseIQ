// This component displays single Category card & handles Edit / Delete actions too

import { useDeleteCategory } from "../hooks/useCategories"
import { getCategoryStyle } from "../utils/categoryHelpers"

const CategoryCard = ({ category, onEdit }) => {
    // console.log(category)

    // Whatever category type comes from backend, making it to uppercase to match with out cat type
    const catType = (category.category_type || '').toUpperCase()

    // Hook to handle category deletion api
    const deleteMutation = useDeleteCategory()
    // get theme color, label based on category type
    const style = getCategoryStyle(catType)

    // delete handler - prompts confirmation as window notification before delete
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${category.category_name}?`)) {
            deleteMutation.mutate(category.id)
        }
    }

    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/40">

            {/* Category icon and title section */}
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${style.bg} ${style.border} ${style.color}`}>
                    {/* SVG Icon Based on Type */}
                    {catType === 'INCOME' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    )}
                </div>
                <div className="truncate">
                    <h3 className="text-gray-200 font-medium truncate">{category.category_name}</h3>
                    <p className={`text-xs ${style.color} font-medium tracking-wide`}>{style.label}</p>
                </div>
            </div>

            {/* Action buttons (Edit & Delete) */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(category)}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    )
}

export default CategoryCard