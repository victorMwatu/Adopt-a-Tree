'use client'
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
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
       <Link href="/contact">Profile</Link>
    </div>


      {/* Button */}
      <button className="bg-[#1FA951] text-white px-4 py-2  rounded-[14px]  transition">
        Get Started
      </button>
    </nav>
  )
}

export default Navbar;