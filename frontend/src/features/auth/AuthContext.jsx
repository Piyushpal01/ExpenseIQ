import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import apiClient, { setAccessToken } from '../../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = useCallback(async (credentials) => {
        console.log("CREDENTIALS => ", credentials);
        
        const response = await apiClient.post('/auth/token/', credentials)

        console.log("RESPONSE => ", response)
        setAccessToken(response.data.access)
        setRefreshToken(response.data.refresh)
        setIsAuthenticated(true)

        // Login endpoint, currently returns tokens, not user profile
        setUser({email: credentials.email})
    }, [])

    const register = useCallback(async (formData) => {
        console.log("Form Data => ", formData);
        
        return apiClient.post('/users/register/', formData)
    }, [])

    const logout = useCallback(async () => {
        try {
            if(refreshToken) {
                await apiClient.post('/users/logout/', {
                    refresh: refreshToken,
                })
            }
        }
        finally {
            setAccessToken(null)
            setRefreshToken(null)
            setUser(null)
            setIsAuthenticated(false)
        }
    }, [refreshToken])

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            login,
            register,
            logout,
        }),
        [user, isAuthenticated, login, register, logout],
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