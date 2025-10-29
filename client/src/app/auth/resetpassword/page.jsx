"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../../components/layout/Navbar";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setMessage("Invalid reset link. Please request a new password reset.");
      setIsSuccess(false);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsSuccess(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setIsSuccess(false);
      return;
    }

    if (!token) {
      setMessage("Invalid reset token");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://adopt-a-tree.onrender.com/api/auth/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Password reset successfully! Redirecting to login...");
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Failed to reset password");
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
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-md">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full max-w-md">
          <div className="flex flex-col">
            <label className="text-xl font-medium mb-1 text-gray-800">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !token}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <span className="text-sm text-gray-500 mt-1">
              Must be at least 8 characters
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-xl font-medium mb-1 text-gray-800">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading || !token}
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="bg-green-600 text-white py-3 rounded-md font-medium cursor-pointer hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
