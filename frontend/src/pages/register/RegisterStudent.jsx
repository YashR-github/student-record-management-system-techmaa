import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/auth.js'

/* Backend-aligned enums (hardcoded by choice) */
const DEPARTMENTS = ['SCIENCE', 'COMMERCE', 'ARTS', 'ENGINEERING']
const GENDERS = ['MALE', 'FEMALE', 'OTHER']

export default function RegisterStudent() {
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
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

        // Sanitize data: Convert empty strings to null for Enums/Optionals
        const payload = { ...form }

        // List of optional or enum fields that fail if sent as ""
        const optionalFields = ['gender', 'department', 'courseId', 'academicYear', 'semester', 'age', 'address']

        optionalFields.forEach(field => {
            if (payload[field] === '') {
                payload[field] = null
            }
        })

        // Ensure numeric fields are numbers if they exist
        if (payload.courseId) payload.courseId = Number(payload.courseId)
        if (payload.academicYear) payload.academicYear = Number(payload.academicYear)
        if (payload.semester) payload.semester = Number(payload.semester)
        if (payload.age) payload.age = Number(payload.age)

        try {
            await authService.registerStudent(payload)
            addToast('Registration successful! Please login.', 'success')
            navigate('/login')
        } catch (err) {
            setError(err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Ribbon */}
                <div className="bg-[#1e293b] px-8 py-6">
                    <h1 className="text-xl font-semibold text-white tracking-wide">
                        Student Registration
                    </h1>
                    <p className="mt-1 text-sm text-slate-300">
                        Fields marked with <span className="text-red-400">*</span> are mandatory
                    </p>
                </div>

                <div className="p-10">
                    {error && (
                        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        <Section title="Basic Information">
                            <Input label="Full Name" name="name" required value={form.name} onChange={handleChange} />
                            <Input label="Email" name="email" required value={form.email} onChange={handleChange} />
                            <Input label="Phone" name="phone" required value={form.phone} onChange={handleChange} />

                            {/* Password field with unified focus border */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>

                                <div
                                    className="flex border border-gray-300 rounded-md
                                    focus-within:border-[2.2px]
               focus-within:border-gray-600
               transition-colors"
                                >
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 px-4 py-2.5
                 border-none rounded-l-md
                 focus:outline-none
                 text-gray-800"
                                    />

                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`px-3 flex items-center justify-center
                  border-l border-gray-300
                  rounded-r-md
                  ${showPassword ? 'bg-gray-300' : 'bg-gray-200'}
                  hover:bg-gray-300
                  transition-colors
                  focus:outline-none`}
                                    >
                                        <EyeIcon active={showPassword} />
                                    </button>
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
                            <Input label="Age" name="age" value={form.age} onChange={handleChange} />

                            <Select
                                label="Gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                options={GENDERS}
                            />

                            <Textarea label="Address" name="address" value={form.address} onChange={handleChange} />
                        </Section>

                        <button className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

/* ---------------- Reusable Components ---------------- */

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
            <div className="grid grid-cols-2 gap-5">{children}</div>
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
                className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
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
                className="w-full border rounded-md px-4 py-2.5 bg-white
                   text-gray-700 font-medium focus:ring-2 focus:ring-blue-600"
            >
                <option value="">Select</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    )
}

function Textarea({ label, ...props }) {
    return (
        <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                {...props}
                rows={3}
                className="w-full border rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-600"
            />
        </div>
    )
}

/* ---------------- Eye Icon ---------------- */

function EyeIcon({ active }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${active ? 'text-gray-1000' : 'text-gray-500'}`}
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