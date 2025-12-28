import { useState, useEffect } from 'react'
import * as authService from '../../services/auth.js'
import { useToast } from '../../context/ToastContext'

/* Enums */
const DEPARTMENTS = ['SCIENCE', 'COMMERCE', 'ARTS', 'ENGINEERING']
const GENDERS = ['MALE', 'FEMALE', 'OTHER']

export default function StudentRegistrationForm({ isAdminMode = false, onSuccess }) {
    const { addToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: isAdminMode ? '12345678' : '',
        courseId: '',
        department: '',
        academicYear: '',
        semester: '',
        age: '',
        gender: '',
        address: ''
    })

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const payload = { ...form }

        // Optional fields null check
        const optionalFields = ['gender', 'department', 'courseId', 'academicYear', 'semester', 'age', 'address']
        optionalFields.forEach(field => {
            if (payload[field] === '') {
                payload[field] = null
            }
        })

        // Numeric conversions
        if (payload.courseId) payload.courseId = Number(payload.courseId)
        if (payload.academicYear) payload.academicYear = Number(payload.academicYear)
        if (payload.semester) payload.semester = Number(payload.semester)
        if (payload.age) payload.age = Number(payload.age)

        try {
            await authService.registerStudent(payload)
            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            setError(err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            {error && (
                <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Section title="Basic Information">
                    <Input label="Full Name" name="name" required value={form.name} onChange={handleChange} />
                    <Input label="Email" name="email" required value={form.email} onChange={handleChange} />
                    <Input label="Phone" name="phone" required value={form.phone} onChange={handleChange} />

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {isAdminMode ? '(Default: 12345678)' : <span className="text-red-500">*</span>}
                        </label>

                        <div className={`flex border border-gray-300 rounded-md focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 transition-colors ${isAdminMode ? 'bg-gray-100' : ''}`}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                disabled={isAdminMode}
                                className="flex-1 px-4 py-2.5 border-none rounded-l-md focus:outline-none text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
                            />

                            {!isAdminMode && (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="px-3 flex items-center justify-center border-l border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-200 transition-colors focus:outline-none"
                                >
                                    <EyeIcon active={showPassword} />
                                </button>
                            )}
                        </div>
                    </div>
                </Section>

                <Section title="Academic Information">
                    <Input label="Course ID" name="courseId" required value={form.courseId} onChange={handleChange} />

                    <Select
                        label="Department"
                        name="department"
                        required
                        value={form.department}
                        onChange={handleChange}
                        options={DEPARTMENTS}
                    />

                    <Input label="Academic Year" name="academicYear" required value={form.academicYear} onChange={handleChange} />
                    <Input label="Semester" name="semester" required value={form.semester} onChange={handleChange} />
                </Section>

                <Section title="Additional Information (Optional)">
                    <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} />

                    <Select
                        label="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        options={GENDERS}
                    />

                    <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
                </Section>

                <button
                    disabled={loading}
                    className={`w-full py-2.5 rounded-md font-medium text-white transition-all duration-200 active:scale-95 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
                >
                    {loading ? 'Processing...' : (isAdminMode ? 'Register Candidate' : 'Register')}
                </button>
            </form>
        </div>
    )
}

/* Helpers */
function Section({ title, children }) {
    return (
        <div className="p-1">
            <h3 className="text-sm font-semibold text-gray-800 border-b pb-1 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
        </div>
    )
}

function Input({ label, required, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                required={required}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
                <option value="">Select</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

function Textarea({ label, ...props }) {
    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                {...props}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
        </div>
    )
}

function EyeIcon({ active }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-gray-700' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    )
}
