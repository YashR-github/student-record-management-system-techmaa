import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function StudentDashboard() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const { addToast } = useToast()

    async function handleLogout() {
        await logout()
        addToast('Logged out successfully', 'success')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Ribbon */}
            <div className="bg-[#1e293b] px-8 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-wide">
                        Student Dashboard
                    </h1>
                    <p className="text-sm text-slate-300 mt-1">
                        Student Portal
                    </p>
                </div>
                <div>
                    <Link to="/student/profile" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 mr-3">Profile</Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Welcome!</h2>
                    <p className="text-gray-600">
                        You can view and edit your profile details by clicking the "Profile" button above.
                    </p>
                </div>
            </div>
        </div>
    )
}
