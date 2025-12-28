import React, { useEffect, useState } from 'react'

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title = "Delete Account", message = "Are you sure you want to delete your account? This action cannot be undone and you will lose all access immediately." }) {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 200)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isOpen && !isAnimating) return null

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-200 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-6">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-medium text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
