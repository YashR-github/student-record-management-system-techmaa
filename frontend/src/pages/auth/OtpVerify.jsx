// src/pages/OTPVerify.jsx
import React, { useRef, useState, useEffect } from 'react'
import * as authService from '../../services/auth'
import InlineError from '../../components/InlineError'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function OTPVerify({ email }) {
    const navigate = useNavigate()
    const { loginWithOTP } = useAuth()
    const { addToast } = useToast()
    const length = 6
    const [digits, setDigits] = useState(Array(length).fill(''))
    const inputsRef = useRef([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        inputsRef.current[0]?.focus()
    }, [])

    const value = digits.join('')
    const isComplete = value.length === length && !digits.includes('')

    function onDigitChange(idx, v) {
        if (!/^\d*$/.test(v)) return
        const next = [...digits]
        next[idx] = v.slice(-1) // keep single char
        setDigits(next)

        if (v && idx < length - 1) {
            inputsRef.current[idx + 1]?.focus()
        }
    }

    function onKeyDown(idx, e) {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus()
        }
        if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus()
        if (e.key === 'ArrowRight' && idx < length - 1) inputsRef.current[idx + 1]?.focus()
    }

    function onPaste(e) {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
        if (!pasted) return
        const next = Array(length).fill('')
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
        setDigits(next)
        const focusIndex = Math.min(pasted.length, length - 1)
        inputsRef.current[focusIndex]?.focus()
        e.preventDefault()
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        if (!isComplete) return
        setLoading(true)
        try {
            // server verification
            await authService.validateOTP({ email, otp: value })

            // set user context
            const user = await loginWithOTP({ email, otp: value })

            addToast('Login successful', 'success')
            navigate(`/${user.role.toLowerCase()}/dashboard`)
        } catch (err) {
            setError(err?.message || 'Failed to verify OTP')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Enter verification code</h2>
            <p className="text-sm text-slate-600 mb-6">
                An OTP has been sent to your registered email address. Enter the 6-digit code below to continue.
            </p>

            {error && <InlineError>{error}</InlineError>}

            <form onSubmit={handleSubmit} onPaste={onPaste} className="space-y-6">
                <div className="flex justify-between gap-2">
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={el => (inputsRef.current[i] = el)}
                            value={d}
                            onChange={e => onDigitChange(i, e.target.value)}
                            onKeyDown={e => onKeyDown(i, e)}
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg rounded-md border focus:ring-2 focus:ring-green-500"
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={!isComplete || loading}
                        className={`px-4 py-2 rounded-md text-white transition-all duration-200 active:scale-95 ${isComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        {loading ? 'Verifying…' : 'Submit'}
                    </button>

                    <button
                        type="button"
                        onClick={async () => {
                            setError(null)
                            setLoading(true)
                            try {
                                await authService.generateOTP(email)
                                setDigits(Array(length).fill(''))
                                inputsRef.current[0]?.focus()
                                addToast('OTP Resent', 'success')
                            } catch (err) {
                                setError(err?.message || 'Failed to resend OTP')
                            } finally {
                                setLoading(false)
                            }
                        }}
                        className="text-sm text-slate-600 underline hover:text-slate-800 transition-colors"
                    >
                        Resend OTP
                    </button>
                </div>
            </form>
        </div>
    )
}

