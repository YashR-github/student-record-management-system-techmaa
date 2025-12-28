import { useEffect, useState, useRef } from 'react'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function StudentTable({ filters }) {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { addToast } = useToast()
    const isFirstRun = useRef(true)

    useEffect(() => {
        async function fetchStudents() {
            setLoading(true)
            setError(null)
            try {
                const query = new URLSearchParams()

                // Parameter Mapping logic based on FilterDTO
                if (filters.keyword) query.append('keyword', filters.keyword)
                if (filters.rollNo) query.append('rollNo', filters.rollNo)
                if (filters.name) query.append('name', filters.name)
                if (filters.email) query.append('email', filters.email)
                if (filters.department && filters.department !== 'All') query.append('department', filters.department)
                if (filters.course) query.append('courseName', filters.course)

                // IMPORTANT: Backend expects 'Gender' (Capitalized)
                if (filters.gender && filters.gender !== 'All') query.append('Gender', filters.gender)

                // Mapped 'year' -> 'academicYear' if needed, or use 'academicYear' directly
                if (filters.year) query.append('academicYear', filters.year)
                if (filters.semester) query.append('semester', filters.semester)
                if (filters.marks) query.append('marks', filters.marks)

                // Sort Params
                if (filters.sortBy) query.append('sortBy', filters.sortBy)
                if (filters.sortDir) query.append('sortDir', filters.sortDir)

                const res = await api.request(`/admin/students/filter?${query.toString()}`)

                const data = Array.isArray(res) ? res : (res?.data || res?.content || [])
                setStudents(data)

                // The parent (AdminDashboard) sets filters.
                if (data.length >= 0) {
                    // To avoid toast on initial mount, we check isFirstRun
                    if (isFirstRun.current) {
                        isFirstRun.current = false
                    } else {
                        addToast('Student records filtered successfully', 'success')
                    }
                }
            } catch (err) {
                console.error('Fetch Error', err)
                const msg = err.status === 401 ? 'Session expired' : 'Failed to fetch records'
                setError(msg)
                addToast(msg, 'error')

                // Keep students empty on error? Or keep previous?
                // Usually empty on error is safer to avoid confusion.
                setStudents([])
            } finally {
                setLoading(false)
            }
        }

        if (Object.keys(filters).length > 0) {
            fetchStudents()
        } else {
            fetchStudents()
        }
    }, [filters])



    async function exportExcel() {
        try {
            //Use relative path so Vite proxy handles forwarding + cookies
            const BASE_URL = ''

            const query = new URLSearchParams()
            // Re-use same mapping logic
            if (filters.keyword) query.append('keyword', filters.keyword)
            // ... (rest of query construction is same, assuming it pulls from filters which is scope accessible) ...
            if (filters.name) query.append('name', filters.name)
            if (filters.email) query.append('email', filters.email)
            if (filters.department && filters.department !== 'All') query.append('department', filters.department)
            if (filters.course) query.append('courseName', filters.course)
            if (filters.gender && filters.gender !== 'All') query.append('Gender', filters.gender)
            if (filters.year) query.append('academicYear', filters.year)
            if (filters.semester) query.append('semester', filters.semester)
            if (filters.marks) query.append('marks', filters.marks)
            if (filters.sortBy) query.append('sortBy', filters.sortBy)
            if (filters.sortDir) query.append('sortDir', filters.sortDir)

            const response = await fetch(`${BASE_URL}/admin/students/filter/export/excel?${query.toString()}`, {
                method: 'GET',
                credentials: 'include', // Send Cookies
            })

            if (!response.ok) {
                // ... error handling ...
                throw new Error('Export failed')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Students_Data.xlsx'
            a.click()
            window.URL.revokeObjectURL(url)

            addToast('Student data exported successfully', 'success')
        } catch (err) {
            console.error('Export Error', err)
            // alert('Failed to export students. ' + err.message) // User wants clean messages.
            // We can use addToast with error type if we want, or just setError.
            // But export is a button action, so toast error is appropriate.
            addToast('Failed to export students: ' + err.message, 'error')
        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                    Student Records {loading && <span className="text-gray-400 font-normal ml-2">(Loading...)</span>}
                </h2>
                <button
                    onClick={exportExcel}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-200"
                >
                    Export to Excel
                </button>
            </div>

            {error ? (
                <div className="p-6 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
                    <p className="font-semibold">{error}</p>
                </div>
            ) : loading && students.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Loading student data...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                {['Roll No', 'Name', 'Email', 'Phone', 'Role', 'Course', 'Department', 'Address', 'Age', 'Gender', 'Year', 'Semester', 'Marks'].map(h => (
                                    <th key={h} className="border px-3 py-2 text-left font-semibold whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map(s => (
                                <tr key={s.id || s.email} className="hover:bg-gray-50 text-gray-800">
                                    <td className="border px-3 py-2">{s.rollNo || '-'}</td>
                                    <td className="border px-3 py-2 font-medium">{s.name}</td>
                                    <td className="border px-3 py-2">{s.email}</td>
                                    <td className="border px-3 py-2">{s.phone || '-'}</td>
                                    <td className="border px-3 py-2">{s.role || '-'}</td>
                                    {/*  Fixed course binding to match backend DTO */}
                                    <td className="border px-3 py-2">{s.courseTitle || '-'}</td>
                                    <td className="border px-3 py-2">{s.department || '-'}</td>
                                    <td className="border px-3 py-2 truncate max-w-xs" title={s.address}>{s.address || '-'}</td>
                                    <td className="border px-3 py-2">{s.age || '-'}</td>
                                    <td className="border px-3 py-2">{s.gender || '-'}</td>
                                    <td className="border px-3 py-2">{s.academicYear || '-'}</td>
                                    <td className="border px-3 py-2">{s.semester || '-'}</td>
                                    <td className="border px-3 py-2">{s.marks !== null ? s.marks : '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="13" className="py-8 text-center text-slate-500">
                                        No students found matching the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
