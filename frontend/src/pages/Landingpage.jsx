import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/swiftpay-logo.svg"
            alt="SwiftPay Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-gray-900">SwiftPay</span>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-gray-600 hover:text-black transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white transition"
          >
            Sign Up
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900 mb-6 max-w-3xl">
          Experience seamless and secure transactions with{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            SwiftPay
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          Your money, your way — simplified and protected. SwiftPay makes
          sending and receiving payments effortless.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/send")}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-medium text-white transition"
          >
            Send Money
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white hover:bg-gray-100 border border-gray-300 px-6 py-3 rounded-lg font-medium transition text-gray-800"
          >
            Dashboard
          </button>
        </div>
      </main>
      <footer className="text-center text-xs text-gray-500 py-3 bg-white border-t">
        © 2025 SwiftPay. All rights reserved.
      </footer>
    </div>
  );
}
