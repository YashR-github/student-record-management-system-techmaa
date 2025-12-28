import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentFilters from './StudentFilters'
import StudentTable from './StudentTable'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import StudentRegistrationForm from '../../components/forms/StudentRegistrationForm'
import StaffRegistrationForm from '../../components/forms/StaffRegistrationForm'

export default function AdminDashboard() {
    const [filters, setFilters] = useState({})
    const { logout } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    // Registration Modal State
    const [showRegMenu, setShowRegMenu] = useState(false)
    const [activeModal, setActiveModal] = useState(null) // 'student' | 'staff' | null
    const menuRef = useRef(null)

    // Handle outside click for menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowRegMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function handleLogout() {
        await logout()
        addToast('User logged out successfully', 'success')
        navigate('/login')
    }

    function handleRegSuccess() {
        addToast('Candidate registered successfully!', 'success')
        setActiveModal(null)
    }

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Modal Layer */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-xl sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {activeModal === 'student' ? 'Register New Student' : 'Register New Staff'}
                            </h2>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {activeModal === 'student' ? (
                                <StudentRegistrationForm isAdminMode={true} onSuccess={handleRegSuccess} />
                            ) : (
                                <StaffRegistrationForm isAdminMode={true} onSuccess={handleRegSuccess} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Ribbon */}
            <div className="bg-[#1e293b] px-8 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-white tracking-wide">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-slate-300 mt-1">
                        Student Record Management
                    </p>
                </div>
                <div className="flex items-center gap-3">

                    {/* Register Candidates Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowRegMenu(!showRegMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all duration-200"
                        >
                            <span>Register Candidate</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showRegMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showRegMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={() => { setActiveModal('student'); setShowRegMenu(false) }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Register Student
                                </button>
                                <button
                                    onClick={() => { setActiveModal('staff'); setShowRegMenu(false) }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    Register Staff
                                </button>
                            </div>
                        )}
                    </div>

                    <Link to="/admin/profile" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200">Profile</Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 active:bg-red-800 active:scale-95 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <StudentFilters onApply={setFilters} />
                <StudentTable filters={filters} />
            </div>
        </div>
    )
}


