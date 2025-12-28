import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const GENDERS = ['MALE', 'FEMALE', 'OTHER']

export default function StudentProfileEdit() {
    const navigate = useNavigate()
    const [form, setForm] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/student/profile')
            .then(res => setForm(res.data))
            .catch(() => {})
    }, [])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            await api.put('/student/profile', {
                address: form.address,
                age: form.age ? Number(form.age) : null,
                gender: form.gender
            })
            navigate('/student/profile')
        } catch {
            setError('Update failed')
        }
    }

    if (!form) return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-xl bg-white p-8 rounded-xl shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Edit Profile
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input label="Address" name="address" value={form.address || ''} onChange={handleChange} />
                    <Input label="Age" name="age" value={form.age || ''} onChange={handleChange} />

                    <Select
                        label="Gender"
                        name="gender"
                        value={form.gender || ''}
                        onChange={handleChange}
                        options={GENDERS}
                    />

                    <button className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                {...props}
                className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:border-gray-400"
            />
        </div>
    )
}

function Select({ label, options, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                {...props}
                className="w-full border rounded-md px-4 py-2.5 bg-white focus:outline-none focus:border-gray-400"
            >
                <option value="">Select</option>
                {options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
        </div>
    )
}
