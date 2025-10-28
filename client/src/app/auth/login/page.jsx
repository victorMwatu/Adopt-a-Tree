"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../../components/layout/Navbar";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const{ login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        router.push("/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col items-center mt-10 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-md">

          <div className="flex flex-col">
            <label className="text-xl font-medium mb-1 text-gray-800">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xl font-medium mb-1 text-gray-800">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a 
          href="/auth/forgotpassword" 
          className="text-sm text-green-600 hover:underline mt-1 self-end"
        >
          Forgot password?
        </a>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-md font-medium cursor-pointer hover:bg-green-700 transition"
          >
            Login
          </button>

          {message && (
            <p className="text-center text-red-500 text-sm mt-2">{message}</p>
          )}
        </form>
        <p className="text-center text-gray-600 mt-6">
        Don't have an account?{" "}
        <a href="/auth/signup" className="text-green-600 font-medium hover:underline">
          Sign up
        </a>
      </p>
      </div>
    </main>
  );
}