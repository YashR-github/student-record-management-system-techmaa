
import React, { useEffect, useState } from 'react'
import * as authService from '../../services/auth'
import InlineError from '../../components/InlineError'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import ChangePasswordModal from '../../components/modals/ChangePasswordModal'
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal'

export default function AdminProfile() {
    const { logout } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})

    // Password Modal State
    const [isPassModalOpen, setIsPassModalOpen] = useState(false)
    const [pendingPassword, setPendingPassword] = useState(null)

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        setLoading(true)
        setError(null)
        try {
            const res = await authService.getProfile('admin')
            setData(res.data || res)
        } catch (err) {
            setError(err?.message || 'Failed to load profile')
            addToast('Failed to load profile', 'error')
        } finally {
            setLoading(false)
        }
    }

    function setField(k, v) {
        setData(prev => ({ ...prev, [k]: v }))
        if (fieldErrors[k]) {
            setFieldErrors(prev => ({ ...prev, [k]: undefined }))
        }
    }

    function handlePasswordUpdate(newPass) {
        setPendingPassword(newPass)
        setIsPassModalOpen(false)
        addToast('Password updated in form. Click "Save Changes" to persist.', 'success')
    }

    async function handleSave(e) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setFieldErrors({})
        try {
            const payload = {
                name: data.name,
                gender: data.gender || null,
                // Only include password if changed
                ...(pendingPassword && { password: pendingPassword })
            }
            // Note: Phone is in Response DTO but NOT in Update DTO, so we exclude it.

            await authService.updateProfile('admin', payload)
            addToast('Profile updated successfully', 'success')
            setPendingPassword(null) // Reset pending
            await fetchProfile()
        } catch (err) {
            if (err?.errors) setFieldErrors(err.errors)
            else {
                const msg = err?.message || 'Failed to update profile'
                setError(msg)
                addToast(msg, 'error')
            }
        } finally {
            setSaving(false)
        }
    }

    function handleDeleteClick() {
        setIsDeleteModalOpen(true)
    }

    async function confirmDelete() {
        setIsDeleteModalOpen(false)
        try {
            await authService.deleteProfile('admin')
            addToast('Account deleted successfully', 'success')
            await logout()
            navigate('/login')
        } catch (err) {
            addToast(err?.message || 'Failed to delete account', 'error')
        }
    }

    if (loading && !data) return <div className="p-8 text-center text-gray-500">Loading profile...</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <ChangePasswordModal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                onSave={handlePasswordUpdate}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#1e293b] px-8 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-white tracking-wide">
                            My Profile
                        </h1>
                        <p className="text-slate-300 text-sm mt-1">Admin Account</p>
                    </div>
                </div>

                <div className="p-8">
                    {error && <InlineError>{error}</InlineError>}

                    {data ? (
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
                                    <input
                                        value={data.adminId || ''}
                                        disabled
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        value={data.name || ''}
                                        onChange={e => setField('name', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <InlineError>{fieldErrors.name}</InlineError>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        value={data.email || ''}
                                        disabled
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        value={data.phone || ''}
                                        disabled
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    {/* Phone is read-only per DTO Update specs (not in UpdateReqDTO) */}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={data.gender || ''}
                                        onChange={e => setField('gender', e.target.value === '' ? null : e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">— Optional —</option>
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                    <InlineError>{fieldErrors.gender}</InlineError>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative group cursor-pointer" onClick={() => setIsPassModalOpen(true)}>
                                        <input
                                            value="xxxxxx"
                                            disabled
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-700 cursor-pointer group-hover:border-blue-400 focus:outline-none"
                                        />
                                        <div className="absolute right-3 top-2.5 text-gray-400 group-hover:text-blue-600 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {pendingPassword && <p className="text-xs text-green-600 mt-1">Password changed (unsaved)</p>}
                                </div>
                            </div>

                            <div className="pt-6 border-t flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="px-4 py-2 text-red-600 border border-red-200 bg-red-50 rounded-md hover:bg-red-100 active:scale-95 transition-all duration-200 text-sm font-medium"
                                >
                                    Delete Profile
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-6 py-2 rounded-md text-white font-medium shadow-sm active:scale-95 transition-all duration-200 ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center text-red-500">Failed to load profile data.</div>
                    )}
                </div>
            </div>
        </div>
    )
}


