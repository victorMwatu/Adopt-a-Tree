"use client";
import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setEmail(""); 
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col items-center mt-10 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-md">
          Enter your email address and we'll send you a link to reset your password.
        </p>

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
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white py-3 rounded-md font-medium cursor-pointer hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <div className={`p-3 rounded-md text-center ${
              isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}
        </form>

        <p className="text-center text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/auth/login" className="text-green-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}