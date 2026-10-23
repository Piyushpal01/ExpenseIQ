/* This file serves as Axios client & API configuration */

import axios from 'axios'

let accessToken = null

export function setAccessToken(token) {
    accessToken = token
}

// Pre-configured Axios instance for all backend requests
const apiClient = axios.create({
    // Fallback to local Django server if .env variable is missing
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

    // Tells Django we are sending JSON data
    headers: {
        'Content-Type': 'application/json',
    },

    // Abort request if backend takes longer than 15s
    timeout: 15000,
})

// Interceptor: acts like a middleware checkpoint between frontend React application and backend API.
// REQUEST INTERCEPTOR: Attach access token to headers
apiClient.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

export default apiClient