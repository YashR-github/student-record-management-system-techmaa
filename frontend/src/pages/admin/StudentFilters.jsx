import { useState } from 'react'

const DEPARTMENTS = ['SCIENCE', 'COMMERCE', 'ARTS', 'ENGINEERING']
const GENDERS = ['MALE', 'FEMALE', 'OTHER']

export default function StudentFilters({ onApply }) {
    const [filters, setFilters] = useState({
        keyword: '',
        rollNo: '',
        name: '',
        email: '',
        phone: '',
        courseName: '',
        department: '',
        gender: '',
        academicYear: '',
        semester: '',
        marks: '',
        sortBy: 'createdAt',
        sortDir: 'asc'
    })

    function handleChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    function applyFilters() {
        onApply({
            ...filters,
            academicYear: filters.academicYear ? Number(filters.academicYear) : null,
            semester: filters.semester ? Number(filters.semester) : null,
            marks: filters.marks ? Number(filters.marks) : null
        })
    }

    function resetFilters() {
        const reset = {
            keyword: '',
            rollNo: '',
            name: '',
            email: '',
            phone: '',
            courseName: '',
            department: '',
            gender: '',
            academicYear: '',
            semester: '',
            marks: '',
            sortBy: 'createdAt',
            sortDir: 'asc'
        }
        setFilters(reset)
        onApply({})
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Filter Students
            </h2>

            <div className="grid grid-cols-4 gap-4">
                <Input label="Keyword" name="keyword" value={filters.keyword} onChange={handleChange} />
                <Input label="Roll No" name="rollNo" value={filters.rollNo} onChange={handleChange} />
                <Input label="Name" name="name" value={filters.name} onChange={handleChange} />
                <Input label="Email" name="email" value={filters.email} onChange={handleChange} />
                <Input label="Phone" name="phone" value={filters.phone} onChange={handleChange} />
                <Input label="Course Name" name="courseName" value={filters.courseName} onChange={handleChange} />

                <Select label="Department" name="department" value={filters.department} onChange={handleChange} options={DEPARTMENTS} />
                <Select label="Gender" name="gender" value={filters.gender} onChange={handleChange} options={GENDERS} />

                <Input label="Academic Year" name="academicYear" type="number" value={filters.academicYear} onChange={handleChange} />
                <Input label="Semester" name="semester" type="number" value={filters.semester} onChange={handleChange} />
                <Input label="Marks ≥" name="marks" type="number" min="0" value={filters.marks} onChange={handleChange} />

                <Select
                    label="Sort By"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleChange}
                    showAll={false}
                    options={['createdAt', 'name', 'email', 'phone', 'courseTitle', 'department', 'marks', 'academicYear']}
                />

                <Select
                    label="Sort Direction"
                    name="sortDir"
                    value={filters.sortDir}
                    onChange={handleChange}
                    showAll={false}
                    options={['asc', 'desc']}
                />
            </div>

            <div className="mt-4 flex gap-3">
                <button
                    onClick={applyFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200"
                >
                    Apply Filters
                </button>
                <button
                    onClick={resetFilters}
                    className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all duration-200"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}

/* ---------- Small reusable inputs ---------- */

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
            </label>
            <input
                {...props}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400"
            />
        </div>
    )
}

function Select({ label, options, showAll = true, ...props }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}
            </label>
            <select
                {...props}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-gray-400"
            >
                {showAll && <option value="">All</option>}
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}
