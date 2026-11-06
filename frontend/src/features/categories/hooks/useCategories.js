// this file create APIs call & have Tanstack Query setup for categories.
// Hook: handles Category CRUD APIs using Tanstack Query

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import apiClient from "../../../api/client"

// Global query key so that caching and invalidation happen properly
export const categoryQueryKey = ["categories"]

// 1. fetch categories
async function fetchCategories() {
    const response = await apiClient.get('/categories/')

    // DRF pagination check
    return Array.isArray(response.data)
    ? response.data
    : response.data.results || []
}

// 2. Create category
async function createCategory(categoryData) {
    const response = await apiClient.post('/categories/', categoryData)
    console.log(response)
    return response.data
}

// 3. Update category
async function updateCategory({ id, categoryData }) {
    const response = await apiClient.patch(`/categories/${id}/`, categoryData)
    return response.data
}

// 4. Delete category(hard delete)
async function deleteCategory(id) {
    const resposne = await apiClient.delete(`/categories/${id}/`)
    return resposne.data
}

// Exporting Hooks
export function useCategories() {
    return useQuery({
        queryKey: categoryQueryKey,
        queryFn: fetchCategories,
    })
}

// useMutation: Used for manually triggering server write operations (POST, PATCH, DELETE)
// invalidateQueries: Marks cached data as stale and triggers an automatic background refetch to sync the UI

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            // Mark cached list as stale so useCategories auto-refetches fresh data
            queryClient.invalidateQueries({ queryKey: categoryQueryKey })
        }
    })
}

// Updates an existing category by ID and refreshes the UI list
export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            // Auto-refresh cached categories to reflect updated changes
            queryClient.invalidateQueries({ queryKey: categoryQueryKey })
        }  
    })
}

// Deletes a category by ID and syncs the UI list
export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            // Remove deleted item from UI by refetching the list
            queryClient.invalidateQueries({ queryKey: categoryQueryKey})
        }
    })
}