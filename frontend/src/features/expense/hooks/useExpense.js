// Hooks for Income CRUD operations, using Tanstack query

import { useQuery, useQueryClient, useMutation, keepPreviousData } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Global query key
export const ExpenseQueryKey = ["expense"]

// Remove empty filter values so clean query params are sent to DRF
function buildCleanParams(filters = {}) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    )
}

// Fetch filtered/sorted expense records
async function fetchExpenses(filters = {}) {
    const params = buildCleanParams(filters)
    const response = await apiClient.get('/expense/', {params})
    
    // DRF paginatipn check
    return Array.isArray(response.data)
    ? response.data
    : response.data.results || []
}

// Create new expense
async function createExpense(expenseData) {
    const response = await apiClient.post('/expense/', expenseData)
    return response.data
}

// Update expense
async function updateExpense({ id, expenseData }) {
    const response = await apiClient.patch(`/expense/${id}/`, expenseData)
    return response.data
}

// Delete expense
async function deleteExpense(id) {
    const response = await apiClient.delete(`/expense/${id}/`)
    return response.data
}

// Custom hooks for performing above expense CRUD operations
// Fetch expense hook with server-side search, filter & ordering
export function useExpense(filters = {}) {
    const cleanParams = buildCleanParams(filters)
    
    return useQuery({
        queryKey: [...ExpenseQueryKey, cleanParams],
        queryFn: () => fetchExpenses(cleanParams),
        placeholderData: keepPreviousData,   // Keeps old list visible while new filtered data loads
    })
}

// Add expense
export function useCreateExpense() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            // Invalidate 'expense' to refresh list, and 'accounts' because balance will decrease!
            queryClient.invalidateQueries({queryKey: ExpenseQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        }
    })
}

// Update expense hook
export function useUpdateExpense() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateExpense,
        onSuccess: () => {
            // Update queries again to refllect new balances and records
            queryClient.invalidateQueries({queryKey: ExpenseQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        }
    })
}

// Delete expense hook
export function useDeleteExpense() {
    const queryClient = useQueryClient()

    return useMutation({
        // Balance will increase (money comes back) when an expense is deleted
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ExpenseQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        }
    })
}