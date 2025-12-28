import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth()

    // While checking auth (on refresh)
    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Role mismatch
    if (role && user.role !== role) {
        return <Navigate to="/login" replace />
    }

    return children
}
