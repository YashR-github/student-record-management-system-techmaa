// src/layouts/AdminLayout.jsx
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
