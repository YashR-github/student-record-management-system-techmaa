// src/services/auth.js
import api from './api.js'

// Password login (email OR phone)
export async function loginWithPassword(payload) {
    return api.request('/auth/login-user', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

// Generate OTP (email-based)
export async function generateOTP(email) {
    return api.request('/auth/login/generate-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
}

// Validate OTP
export async function validateOTP(payload) {
    return api.request('/auth/login/validate-otp', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

// Logout
export async function logout() {
    return api.request('/auth/logout-user', { method: 'POST' })
}

// Registration
export async function registerStudent(payload) {
    return api.request('/auth/register-student', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export async function registerStaff(payload) {
    return api.request('/auth/register-staff', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export async function registerAdmin(payload) {
    return api.request('/auth/register-admin', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

// Profile - Get
export async function getProfile(role) {
    // role: 'student', 'staff', 'admin'
    return api.request(`/${role}/profile`)
}

// Profile - Update
export async function updateProfile(role, payload) {
    return api.request(`/${role}/profile/update`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

// Profile - Delete
export async function deleteProfile(role) {
    return api.request(`/${role}/delete`, {
        method: 'DELETE'
    })
}
