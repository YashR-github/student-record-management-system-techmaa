// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    if (!user) return null

    return (
        <header style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
            <strong>Techmaa Portal</strong>

            <span style={{ marginLeft: 20 }}>
        Role: {user.role}
      </span>

            <button
                onClick={handleLogout}
                style={{ float: 'right' }}
            >
                Logout
            </button>
        </header>
    )
}
