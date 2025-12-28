import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)

    const { loginWithPassword } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            const payload = identifier.includes('@')
                ? { email: identifier, password }
                : { phone: identifier, password }

            const user = await loginWithPassword(payload)
            addToast('Login successful', 'success')
            navigate(`/${user.role.toLowerCase()}/dashboard`)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">

                {/* NAVY RIBBON HEADER */}
                <div className="bg-[#1e293b] px-8 py-6">
                    <h1 className="text-2xl font-semibold text-white tracking-wide">
                        Techmaa Login Portal
                    </h1>
                    <p className="mt-1 text-sm text-slate-300">
                        Secure access for Admin, Staff & Students
                    </p>
                </div>

                {/* BODY */}
                <div className="p-10">

                    {error && (
                        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone
                            </label>
                            <input
                                type="text"
                                placeholder="Enter registered email or phone"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                required
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        )}
                                        {showPassword && (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium
                         hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200"
                        >
                            Login
                        </button>
                    </form>

                    {/* OTP BUTTON */}
                    <div className="mt-6">
                        <Link
                            to="/login/otp"
                            className="block text-center w-full border border-green-600 text-green-700 py-2.5 rounded-md font-medium
                         hover:bg-green-600 hover:text-white active:scale-95 transition-all duration-200"
                        >
                            Login with OTP
                        </Link>
                    </div>

                    {/* REGISTER */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                            New user? Register as
                        </p>

                        <div className="flex justify-center gap-3">
                            {['Student', 'Staff', 'Admin'].map(role => (
                                <Link
                                    key={role}
                                    to={`/register/${role.toLowerCase()}`}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700
                             hover:bg-gray-200 hover:border-gray-400 active:scale-95 transition-all duration-200"
                                >
                                    {role}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

