// src/layouts/StudentLayout.jsx
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

export default function StudentLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
