
// src/services/api.js
const BASE_URL =
    (import.meta?.env && import.meta.env.VITE_API_BASE) ||
    '' // Gemini3ProxyFix: Empty string to allow proxying via Vite

/**
 * ApiError - thrown by request()
 *  - message: top-level error message
 *  - status: HTTP status
 *  - errors: optional object containing field->message mapping
 */
export class ApiError extends Error {
    constructor(message, status = 500, errors = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.errors = errors
    }
}

/**
 * request(endpoint, options)
 * - Parses JSON only when present
 * - Converts non-2xx to ApiError with field errors if present
 * - Default header Content-Type application/json
 */
async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`

    const response = await fetch(url, {
        credentials: 'include', // CRITICAL for HttpOnly Cookies
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    })

    const contentType = response.headers.get('content-type') || ''

    // parse body safely
    const parseBody = async () => {
        try {
            if (contentType.includes('application/json')) return await response.json()
            return await response.text()
        } catch {
            return null
        }
    }

    if (!response.ok) {
        const body = await parseBody()

        // backend error shape from ControllerAdvice: 
        // { message: "Request Failed", data: { details: "Real error msg", error: "Type", ... } }
        // OR for validation:
        // { message: "Validation failure", data: { field: "error" } }

        if (body && typeof body === 'object') {
            // Priority 1: Nested details (custom exception info)
            let detailedMessage = body.data?.details

            // Priority 2: Direct message (standard Spring Boot or custom)
            if (!detailedMessage) detailedMessage = body.message

            // Priority 3: 'error' field (Spring Security often sends this)
            if (!detailedMessage) detailedMessage = body.error

            // Priority 4: If data is just a string, use it
            if (!detailedMessage && typeof body.data === 'string') detailedMessage = body.data

            // Verification: Fallback if everything is empty
            if (!detailedMessage) detailedMessage = `HTTP ${response.status} Unknown Error`

            // Capture validation errors
            let fieldErrors = null
            if (body.message === 'Validation failure' && body.data && typeof body.data === 'object') {
                fieldErrors = body.data
                detailedMessage = 'Validation failed. Please check the fields.'
            }

            throw new ApiError(detailedMessage, response.status, fieldErrors)
        }

        const text = (typeof body === 'string' && body.trim()) ? body : `HTTP ${response.status}`
        throw new ApiError(text, response.status, null)
    }

    // success - no content
    if (response.status === 204) return null

    // success - JSON or text
    if (contentType.includes('application/json')) return await response.json()
    return await response.text()
}

export default { request }
