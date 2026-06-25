import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();

  if (res.ok) {
    if (data.token) localStorage.setItem("token", data.token);
    // Redirect to login
    navigate("/login");
  } else {
    setError(data.message || "Registration failed");
  }
} catch (err) {
  console.error(err);
  setError("Server error. Try again.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-200 to-pink-200 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-pink-300 mb-4">
          📝 Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-400 hover:bg-pink-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
  }

