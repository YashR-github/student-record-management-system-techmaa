import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as authService from '../../services/auth'
import OtpVerify from './OtpVerify'

export default function OTPLogin() {
    const [email, setEmail] = useState('')

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const { loginWithOTP } = useAuth()

    async function handleGenerateOTP() {
        setLoading(true)
        setError(null)
        try {
            await authService.generateOTP(email)
            setStep(2)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">

                {/* HEADER */}
                <div className="bg-[#1e293b] px-8 py-6">
                    <h1 className="text-xl font-semibold text-white tracking-wide">
                        OTP Authentication
                    </h1>
                    <p className="mt-1 text-sm text-slate-300">
                        Verify your identity using a one-time password
                    </p>
                </div>

                <div className="p-10">

                    {error && (
                        <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-2">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registered Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter registered email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <button
                                onClick={handleGenerateOTP}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2.5 rounded-md font-medium
                           hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-200 disabled:opacity-60"
                            >
                                {loading ? 'Sending OTP…' : 'Generate OTP'}
                            </button>
                        </div>
                    )}

                    {step === 2 && <OtpVerify email={email} />}

                </div>
            </div>
        </div>
    )
}


