import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (result.success) {
        setAlertMessage(`Thank you, ${form.name}! Your message has been sent successfully.`);
        setAlertType("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setAlertMessage(`Failed to send message: ${result.message}`);
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("Network error - please try again later.");
      setAlertType("error");
      console.error('Error:', error);
    } finally {
      setLoading(false);
      
      // Clear alert after 5 seconds
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="min-h-screen bg-[#ECE1D6]/20 dark:bg-gray-900/20 py-24 px-6 flex justify-center">
        <div className="max-w-4xl w-full bg-[#856a73] backdrop-blur-md rounded-2xl shadow-lg p-8 transition-all duration-300">
          
          {/* Alert Message */}
          {alertMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              alertType === "success" 
                ? "bg-green-100 text-green-800 border border-green-400" 
                : "bg-red-100 text-red-800 border border-red-400"
            }`}>
              {alertMessage}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#4B4B4B] dark:text-gray-100">
            Contact Us
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
            Have questions or suggestions? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ac4467] transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ac4467] transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
              disabled={loading}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ac4467] transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
              disabled={loading}
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ac4467] hover:bg-pink-500 text-white font-semibold px-5 py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center" role="status" aria-live="polite">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;