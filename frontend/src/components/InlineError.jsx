// src/components/InlineError.jsx
import React from 'react'

export default function InlineError({ children, className = '' }) {
    if (!children) return null
    return (
        <p className={`mt-1 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-1 ${className}`}>
            {children}
        </p>
    )
}
