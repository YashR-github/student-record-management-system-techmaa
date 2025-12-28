// src/layouts/StaffLayout.jsx
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

export default function StaffLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
