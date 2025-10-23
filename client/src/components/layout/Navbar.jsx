'use client'
import React from 'react'
import Link from 'next/link'
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
};
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white text-black w-full shadow-md">
     
     {/* Logo */}
     <img src="/assets/logo1.png" alt="logo" className="w-16 h-15" />

      <Link href="/" className="text-2xl font-bold ml-2">
            Adopt a Tree
      </Link>

     {/* Navigation Links */}
    <div className="flex gap-8 mr-8 ml-auto">
       <Link href="/">Home</Link>
       <Link href="/dashboard">Dashboard</Link>
          <Link href="/adopt">Adopt</Link>
       <Link href="/about">Leaderboard</Link>
    </div>


    {user ? (
        <div className="flex items-center gap-3">
          <span className="font-medium">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white cursor-pointer px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/auth/login")}
            className="text-green-700 cursor-pointer hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/auth/signup")}
            className="bg-green-600 text-white px-3 py-1 cursor-pointer rounded hover:bg-green-700 transition"
          >
            Signup
          </button>
        </div>
    )}    
</nav>
  )
}

export default Navbar;