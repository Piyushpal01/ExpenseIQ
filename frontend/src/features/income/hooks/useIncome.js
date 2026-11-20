// Hooks for Income CRUD operations, using Tanstack query

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Global query key
export const IncomeQueryKey = ["income"]

// Remove empty filter values so clean query params are sent to DRF
function buildCleanParams(filters = {}) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    )
}

// Fetch filtered/sorted income records
async function fetchIncomes(filters = {}) {
    const params = buildCleanParams(filters)
    const response = await apiClient.get('/income/', {params})
    
    // DRF pagination check
    return Array.isArray(response.data)
    ? response.data
    : response.data.results || []
}

// Create new income
async function createIncome(incomeData) {
    const response = await apiClient.post('/income/', incomeData)
    return response.data
}

// Update income
async function updateIncome({ id, incomeData }) {
    const response = await apiClient.patch(`/income/${id}/`, incomeData)
    return response.data
}

// Delete income
async function deleteIncome(id) {
    const response = await apiClient.delete(`/income/${id}/`)
    return response.data
}

// Custom hooks for performing above income CRUD operations

// Fetch income hook with server-side search, filter & ordering
export function useIncome(filters = {}) {
    const cleanParams = buildCleanParams(filters)

    return useQuery({
        queryKey: [...IncomeQueryKey, cleanParams],
        queryFn: () => fetchIncomes(cleanParams),
        placeholderData: keepPreviousData,
    })
}

// add income hook
export function useCreateIncome() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: createIncome,
        onSuccess: () => {
            // Invalidate 'income' to refresh list, and 'accounts' because balance will increase!
            queryClient.invalidateQueries({queryKey: IncomeQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        }
    })
}

// Update income hook
export function useUpdateIncome() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateIncome,
        onSuccess: () => {
            // Update queries again to reflect new balances and records
            queryClient.invalidateQueries({queryKey: IncomeQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        }
    })
}

// Delete income hook
export function useDeleteIncome() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteIncome,
        onSuccess: () => {
            // Balance will decrease when an income is deleted
            queryClient.invalidateQueries({queryKey: IncomeQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]}) // Balance will decrease
        }
    })
}