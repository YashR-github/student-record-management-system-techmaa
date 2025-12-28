import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import StaffRegistrationForm from '../../components/forms/StaffRegistrationForm'

export default function RegisterStaff() {
    const navigate = useNavigate()
    const { addToast } = useToast()

    const handleSuccess = () => {
        addToast('Registration successful! Please login.', 'success')
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#1e293b] px-8 py-6">
                    <h1 className="text-xl font-semibold text-white tracking-wide">
                        Staff Registration
                    </h1>
                </div>

                <div className="p-8">
                    <StaffRegistrationForm onSuccess={handleSuccess} />
                </div>
            </div>
        </div>
    )
}

/* ---------- Shared Controls ---------- */

function Input({ label, required, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                required={required}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5
                   focus:outline-none focus:border-gray-400"
            />
        </div>
    )
}

function Select({ label, options, required, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                {...props}
                required={required}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5
                   bg-white focus:outline-none focus:border-gray-400"
            >
                <option value="">Select</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

function PasswordField({ value, onChange, showPassword, toggle }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
            </label>

            <div className="flex border border-gray-300 rounded-md
                      focus-within:border-gray-400">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={value}
                    onChange={onChange}
                    required
                    className="flex-1 px-4 py-2.5 focus:outline-none"
                />

                <button
                    type="button"
                    tabIndex={-1}
                    onClick={toggle}
                    className={`px-3 border-l border-gray-300
            ${showPassword ? 'bg-gray-300' : 'bg-gray-200'}
            hover:bg-gray-300 transition-colors`}
                >
                    <EyeIcon active={showPassword} />
                </button>
            </div>
        </div>
    )
}

/* ---------- Eye Icon ---------- */

function EyeIcon({ active }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${active ? 'text-gray-700' : 'text-gray-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5
           c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7
           -4.477 0-8.268-2.943-9.542-7z"
            />
        </svg>
    )
}
