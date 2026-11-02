/* This file holds code Login, register, logout aur authentication state. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import apiClient, { setAccessToken } from '../../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Prevent protected routes from redirecting before session restoration finishes.
    // isInitializing: tells that app is verifying saved session
    const [isInitializing, setIsInitializing] = useState(true)

    // Restore the session after a page reload using the saved refresh token.
    useEffect(() => {
        let isMounted = true    // isMounted: Stops async state updates after provider unmount.

        // restore the session after page reload
        async function restoreSession() {
            // get refresh token from session storage
            const savedRefreshToken = sessionStorage.getItem('refreshToken')

            // if no refreshToken, return
            if(!savedRefreshToken) {
                setIsInitializing(false)
                return
            }

            try {
                const response = await apiClient.post('/auth/token/refresh/', {
                    refresh: savedRefreshToken,
                })
                
                if(!isMounted) {
                    return
                }

                setAccessToken(response.data.access)

                // Save the rotated refresh token if the backend returns one.
                const newRefreshToken = response.data.refresh || savedRefreshToken
                sessionStorage.setItem('refreshToken', newRefreshToken)
                setRefreshToken(newRefreshToken)

                setIsAuthenticated(true)

                // The refresh endpoint does not provide a user profile.
                // A dedicated profile endpoint can be added later if needed.
                setUser(null)
            }
            catch {
                if(!isMounted) return

                // An expired or invalid refresh token cannot restore this session.
                sessionStorage.removeItem('refreshToken')
                setAccessToken(null)
                setRefreshToken(null)
                setUser(null)
                setIsAuthenticated(false)
            }
            finally {
                // Marks initialization as complete in both success and failure scenarios.
                if(isMounted) {
                    setIsInitializing(false)
                }
            }
        }

        // Clear React auth state when the API client reports an expired session.
        function handleSessionExpired() {
            sessionStorage.removeItem('refreshToken')
            setAccessToken(null)
            setRefreshToken(null)
            setUser(null)
            setIsAuthenticated(false)

        }

        // Register the listener before starting asynchronous session restoration.
        window.addEventListener('expenseiq:session-expired', handleSessionExpired)

        restoreSession()

        // Remove the listener and prevent state updates after unmount.
        return () => {
            isMounted = false
            window.removeEventListener('expenseiq:session-expired', handleSessionExpired)
        }
    }, [])

    // Exchange user credentials for JWT access and refresh tokens.
    const login = useCallback(async (credentials) => {
        // console.log("CREDENTIALS => ", credentials);    // users credentials, email and password
        
        const response = await apiClient.post('/auth/token/', credentials)

        // console.log("RESPONSE => ", response); // response.data holds access and refresh token

        // Keep the access token in memory for authenticated API requests.
        setAccessToken(response.data.access)

        // Persist the refresh token so the session can survive a page reload.
        sessionStorage.setItem('refreshToken', response.data.refresh)
        
        setRefreshToken(response.data.refresh)
        setIsAuthenticated(true)

        // Login endpoint, currently returns tokens, not user profile
        setUser({email: credentials.email})
    }, [])

    // Create a new user account. The calling page handles success and errors.
    const register = useCallback(async (formData) => {
        // console.log("Form Data => ", formData);
        
        return apiClient.post('/users/register/', formData)
    }, [])

    // Revoke the refresh token on the backend, then clear local auth state.
    const logout = useCallback(async () => {
        try {
            if(refreshToken) {
                await apiClient.post('/users/logout/', {
                    refresh: refreshToken,
                })
            }
        }
        // Always clear the local session, even if the logout request fails.
        finally {
            // Clear browser and React state even if the backend request fails.
            sessionStorage.removeItem('refreshToken')
            setAccessToken(null)
            setRefreshToken(null)
            setUser(null)
            setIsAuthenticated(false)
        }
    }, [refreshToken])

    // Keep the context value stable unless one of its dependencies changes.
    // useMemo: it avoids unnecessary recreation of the context value.
    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isInitializing,
            login,
            register,
            logout,
        }),
        [user, isAuthenticated, isInitializing, login, register, logout],
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error(`useAuth must be used withing AuthProvider`)
    }
    return context
}