// all account API operations.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Keep the query key consistent across all account-related components.
export const accountsQueryKey = ["accounts"]

// Fetch accounts belonging to the authenticated user.
async function fetchAccounts() {
    const response = await apiClient.get('/accounts/')

    // DRF can return either a paginated object or a plain array as response.
    return Array.isArray(response.data)
        ? response.data
        : response.data.results || []
}

// create a new account
async function createAccount(accountData) {
    const response = await apiClient.post('/accounts/', accountData)
    console.log(response.data)
    return response.data
}

// update an existing account
async function updateAccount({ id, accountData }) {
    const response = await apiClient.patch(`/accounts/${id}/`, accountData)
    return response.data
}

// Deactivate an account instead of permanently deleting it.
async function deactivateAccount(id) {
    // doing soft deletion here, instead of deleting, deactivating it
    const response = await apiClient.patch(`/accounts/${id}/`, {is_active: false})
    return response.data
} 

// custom hook to fetch accounts
export function useAccounts() {
    return useQuery({
        queryKey: accountsQueryKey,
        queryFn: fetchAccounts,
    })
}

// create account mutation - Hook to handle creating a new account via API
export function useCreateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        // Triggers the actual API call function to create the account
        mutationFn: createAccount,
        
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountsQueryKey,
            })
        },
    })
}

// Update account mutation.
export function useUpdateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateAccount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountsQueryKey,
            })
        },
    })
}

// Deactivate account mutation
export function useDeactivateAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deactivateAccount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountsQueryKey,
            })
        },
    })
}   