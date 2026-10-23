/* This is file is for API request & data fetching for dashboard. */

import { useQuery } from "@tanstack/react-query"
import apiClient from "../../api/client"

// fetch financial data / response from django dashboard endpoint
async function fetchDashboard() {
    // get req fetch the authenticated user data
    const response = await apiClient.get('/dashboard/')

    // Axios resposne
    return response.data
}

// Custom hook: sends dashboard data and request status to components
export function useDashboard() {
    return useQuery({
        // Unique query key: TanStack Query uses this key to cache the data.
        queryKey: ['dashboard'],
        // TanStack Query calls this function to fetch the data.
        queryFn: fetchDashboard,
    })
}

/*
useQuery data fetch aur loading/error state manage karta hai.
queryKey: ['dashboard'] is data ki unique cache identity hai.
queryFn woh function hai jo Django API call karta hai.
response.data mein backend ka JSON milta hai.
*/