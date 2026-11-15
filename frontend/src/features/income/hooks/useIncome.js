// Hooks for Income CRUD operations, using Tanstack query

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Global query key
export const IncomeQueryKey = ["income"]

// fetch all income records
async function fetchIncomes() {
    const response = await apiClient.get('/income/')
    
    // DRF pagination check
    return Array.isArray(response.data)
    ? response.data
    : response.data.results || []
}

// create new income
async function createIncome(incomeData) {
    const response = await apiClient.post('/income/', incomeData)
    // console.log("data sent from fronted -> ", incomeData);
    // console.log("Received response data -> ", response.data);
    
    return response.data
}

// update income
async function updateIncome({id, incomeData}) {
    const response = await apiClient.patch(`/income/${id}/`, incomeData)
    return response.data
}

// delete income(hard delete)
async function deleteIncome(id) {
    const response = await apiClient.delete(`/income/${id}/`)
    return response.data
}

// Custom hooks for performing above income CRUD operations

// fetch income hook
export function useIncome() {
    return useQuery({
        queryKey: IncomeQueryKey,
        queryFn: fetchIncomes,
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

// update income hook
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

// delete income hook
export function useDeleteIncome() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteIncome,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: IncomeQueryKey})
            queryClient.invalidateQueries({queryKey: ["accounts"]}) // Balance will decrease
        }
    })
}