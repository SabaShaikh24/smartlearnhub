  import React, { useContext, useState } from "react";
  // eslint-disable-next-line no-unused-vars
  import { motion } from "framer-motion";
  import { useNavigate,Navigate } from "react-router-dom";
  import { UserContext } from "../Context/UserContext";

  export default function Login() {
    // eslint-disable-next-line no-unused-vars
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    

    const navigate = useNavigate();
    if (user) return <Navigate to="/profile" replace />;
    


    const handleLogin = async (e) => {
      e.preventDefault();

      // Reset previous errors
      setError("");

      // Validation
      if (!email || !password) {
        setError("Enter email & password");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Enter a valid email");
        return;
      }

      setLoading(true);

      try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save JWT token
        localStorage.setItem("token", data.token);
        const userData = { email: data.email,    
            role: data.role  }; 
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate("/profile");
      } else {
        setError(data.message || "Login failed");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error(err); 
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };


    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-200 to-pink-200 p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm"
        >
          <h2 className=" text-2xl font-bold text-center text-pink-300 mb-4 select-none"  tabIndex={-1}   contentEditable={false} >🔑 Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error message */}
            {error && <p  role="alert" className="text-red-500 text-sm select-none"  tabIndex={-1} contentEditable={false}  >{error}</p>}

            {/* Email input */}
            <input
              type="email"
              placeholder="Email"
              aria-label="Email address"
              value={email}
                autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm leading-6" 
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm leading-6"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-400 hover:bg-pink-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm mt-2">
      Don’t have an account?{" "}
      <span
        className="text-pink-500 hover:underline cursor-pointer"
        onClick={() => navigate("/register")}
      >
        Register
      </span>
    </p>
          </form>
        </motion.div>
      </div>
    );
  }
