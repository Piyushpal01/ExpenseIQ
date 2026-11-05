// reusable formatting and account utilities.

export { formatCurrency } from "../../../utils/formatCurrency"

// Nested Object (Object having dynamic properties & objects)
// Central configuration mapping for all supported account types and their UI metadata
const ACCOUNT_TYPES = {
    BANK: {
        label: "Bank Account",
        icon: "🏦",
    },
    CASH: {
        label: "Cash",
        icon: "💵",
    },
     UPI: {
        label: "UPI",
        icon: "📱",
    },
    CREDIT_CARD: {
        label: "Credit Card",
        icon: "💳",
    },
    OTHER: {
        label: "Other",
        icon: "📂",
    },
}

// Get user-friendly account type information.
export function getAccountTypeInfo(type) {
    return ACCOUNT_TYPES[type] || ACCOUNT_TYPES.OTHER
}

// Transforms the mapping object into a key-value array format for dropdown selects and filters
export const accountTypeOptions = Object.entries(ACCOUNT_TYPES).map(
    ([ value, {label} ]) => ({ value, label })
)