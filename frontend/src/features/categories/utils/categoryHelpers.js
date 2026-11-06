// Helpers: Manages icon and theme colors for Categories

export const CATEGORY_TYPES = {
    INCOME: {
        label: 'Income',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: 'TrendingUp'
    },
    EXPENSE: {
        label: 'Expense',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        icon: 'TrendingDown'
    },
    // Default fallback for unknown types
    DEFAULT: {
        label: 'Category',
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/20',
        icon: 'Folder'
    }
};

// Returns style config for a given category type, falling back to EXPENSE if invalid
export const getCategoryStyle = (type) => {
    return CATEGORY_TYPES[type] || CATEGORY_TYPES.DEFAULT    
}