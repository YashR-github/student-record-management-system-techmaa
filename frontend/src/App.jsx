import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'

import Login from './pages/auth/Login'
import OtpLogin from './pages/auth/OtpLogin'
import OtpVerify from './pages/auth/OtpVerify'

import RegisterStudent from './pages/register/RegisterStudent'

import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import StaffDashboard from './pages/staff/StaffDashboard'

import ProtectedRoute from './routes/ProtectedRoute'
import RegisterStaff from './pages/register/RegisterStaff'
import RegisterAdmin from './pages/register/RegisterAdmin'
import StudentProfile from './pages/student/StudentProfile'
import StudentProfileEdit from './pages/student/StudentProfileEdit'
import AdminProfile from './pages/admin/AdminProfile'
import StaffProfile from './pages/staff/StaffProfile'

export default function App() {
    return (
        <ToastProvider>
            <Routes>

                {/* ---------- Public ---------- */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/otp" element={<OtpLogin />} />
                <Route path="/login/otp/verify" element={<OtpVerify />} />

                {/* ---------- Registration ---------- */}
                <Route path="/register/student" element={<RegisterStudent />} />
                <Route path="/register/staff" element={<RegisterStaff />} />
                <Route path="/register/admin" element={<RegisterAdmin />} />

                {/* ---------- Admin ---------- */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminProfile />
                        </ProtectedRoute>
                    }
                />

                {/* ---------- Student ---------- */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/profile"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <StudentProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/profile/edit"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <StudentProfileEdit />
                        </ProtectedRoute>
                    }
                />

                {/* ---------- Staff ---------- */}
                <Route
                    path="/staff/dashboard"
                    element={
                        <ProtectedRoute role="STAFF">
                            <StaffDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff/profile"
                    element={
                        <ProtectedRoute role="STAFF">
                            <StaffProfile />
                        </ProtectedRoute>
                    }
                />

                {/* ---------- Fallback ---------- */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </ToastProvider>
    )
}
