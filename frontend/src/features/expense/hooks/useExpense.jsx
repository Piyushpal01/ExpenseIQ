// Hooks for Income CRUD operations, using Tanstack query

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Global query key
export const ExpenseQueryKey = ["expense"]

// Fetch all expense records
async function fetchExpenses() {
    const response = await apiClient.get('/expense/')
    
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
// Fetch expense hook
export function useExpense() {
    return useQuery({
        queryKey: ExpenseQueryKey,
        queryFn: fetchExpenses,
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