import React, { useState } from "react";
import "../index.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email address.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      
      const data = await response.json();
      if (response.ok) {
        setMessage("Subscribed successfully! ✅");
        setEmail("");
      } else {
        setMessage(data.error === "Email already subscribed" 
    ? "📧 Already subscribed!" 
    : "Subscription failed ❌"
        );
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mt-8 p-6 bg-gradient-to-r from-pink-300 to-pink-200 rounded-lg text-pink-900 shadow-lg border border-pink-400">
        <h3 className="text-xl font-semibold mb-2">✨ Stay in the Loop – Get Updates & Tips!</h3>
        <p className="mb-4 text-pink-800">Get the latest updates, study resources, and tutorials delivered to your inbox.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" 
            className="flex-1 px-4 py-2 rounded-lg text-pink-900 bg-white border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition disabled:opacity-50 shadow-md"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {message && (
   <div className={`mt-3 p-3 rounded-lg text-center ${
    message.includes("✅") 
      ? "bg-green-100 text-green-800 border border-green-300" 
      : "bg-red-100 text-red-800 border border-red-300"
    }`}>
    {message}
   </div>
    )}
      </div>
    </section>
  );
}

export default Newsletter;