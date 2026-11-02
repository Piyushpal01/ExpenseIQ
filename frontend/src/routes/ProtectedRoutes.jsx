import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

function ProtectedRoute() {
    const { isAuthenticated, isInitializing } = useAuth()

    // Wait until session restoration has finished before deciding where to route.
    if(isInitializing) {
        return (
            <main className='flex min-h-screen items-center justify-center bg-slate-950 text-slate-200'>
                <p>Restoring your session...</p>
            </main>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute