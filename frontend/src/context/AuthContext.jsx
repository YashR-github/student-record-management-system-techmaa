// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    /**
     * On app load:
     * We DO NOT auto-call backend here.
     * We rely on login response & persisted user snapshot.
     */
    useEffect(() => {
        const cachedUser = localStorage.getItem('techmaa_user')
        if (cachedUser) {
            setUser(JSON.parse(cachedUser))
        }
        setLoading(false)
    }, [])

    // Password-based login (email OR phone handled by backend)
    async function loginWithPassword(payload) {
        const loggedInUser = await authService.loginWithPassword(payload)
        setUser(loggedInUser)
        localStorage.setItem('techmaa_user', JSON.stringify(loggedInUser))
        return loggedInUser
    }

    // OTP validation login
    async function loginWithOTP(payload) {
        const loggedInUser = await authService.validateOTP(payload)
        setUser(loggedInUser)
        localStorage.setItem('techmaa_user', JSON.stringify(loggedInUser))
        return loggedInUser
    }

    async function logout() {
        try {
            await authService.logout()
        } finally {
            setUser(null)
            localStorage.removeItem('techmaa_user')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                loginWithPassword,
                loginWithOTP,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return ctx
}
