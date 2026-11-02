/* This file serves as Axios client & API configuration */

import axios from 'axios'

let accessToken = null
let isRefreshing = null     // isRefreshing: Indicates whether a refresh request is already in progress.
let pendingRequests = []

export function setAccessToken(token) {
    accessToken = token
}


// Notify AuthContext when the session can no longer be restored.
function notifySessionExpired() {
    sessionStorage.removeItem('refreshToken')
    setAccessToken(null)
    window.dispatchEvent(new Event('expenseiq:session-expired'))
}

// Resolve or reject requests that are waiting for the current refresh attempt.
function settlePendingRequests(error, token = null) {
    pendingRequests.forEach(( resolve, reject ) => {
        if(error) {
            reject(error)
        } else {
            resolve(token)
        }
    });
    pendingRequests = []
}

// Centralized Axios client for all backend requests.
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
// Attach the current access token to outgoing API requests.
apiClient.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// Refresh the access token after an eligible request receives a 401 response.
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Network errors and responses without a request config cannot be refreshed.
        if(!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error)
        }

        // Never refresh token-obtain/refresh requests or retry a request twice.
        // _retry: Prevents a request from being infinitely retried.
        if(originalRequest._retry || originalRequest.skipAuthRefresh || originalRequest.url?.includes('/auth/token/')) {
            return Promise.reject(error)
        }
        
        const savedRefreshToken = sessionStorage.getItem('refreshToken')

        if(!savedRefreshToken) {
            notifySessionExpired()
            return Promise.reject(error)
        }

        originalRequest._retry = true
        
        // Wait for the ongoing refresh instead of starting another one.
        if(isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingRequests.push({ resolve, reject })
            }).then((newAccessToken) => {
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return apiClient(originalRequest)
            })
        }

        isRefreshing = true
        
        try {
            const response = await apiClient.post(
                'auth/token/refresh/',
                { refresh: savedRefreshToken },
                { skipAuthRefresh: true }
            )

            const newAccessToken = response.data.access
            const newRefreshToken = response.data.refresh || savedRefreshToken
            // response.data.refresh || savedRefreshToken: Saves / Updates the returned refresh token if backend refresh rotation is enabled; otherwise, the existing token continues to be used, in our app it is enabled check settings.py

            // Keep the latest tokens if the backend rotates refresh tokens.
            setAccessToken(newAccessToken)
            sessionStorage.setItem('refreshToken', newRefreshToken)

            settlePendingRequests(null, newAccessToken)

            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

            return apiClient(originalRequest);
        } 
        catch(refreshError) {
            settlePendingRequests(refreshError)
            notifySessionExpired()
            return Promise.reject(refreshError)
        }
        finally {
            // finally: Releases the lock regardless of whether the refresh attempt succeeds or fails.
            isRefreshing = true
        }
    },
)

export default apiClient