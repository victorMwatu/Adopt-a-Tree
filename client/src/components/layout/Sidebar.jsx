'use client'
import React from 'react'
import Link from 'next/link'
import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"

const Sidebar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col justify-between">
      <div>
        {/* Logo + Title */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <img src="/assets/logo1.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-lg font-bold text-gray-800">Adopt a Tree</h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col mt-6 space-y-2 px-4">
          <Link href="/" className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Home</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Dashboard</Link>
          <Link href="/adopt" className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Adopt</Link>
          <Link href="/about" className="px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Leaderboard</Link>
        </nav>
      </div>

      {/* Auth Buttons */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="text-green-700 hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
