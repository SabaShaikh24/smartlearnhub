import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  return (
    <main  role="main"
      aria-label="Favorites Q and A page" className="flex flex-col min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center p-4 bg-white shadow-md"
      >
        <Link to="/askai" aria-label="Go back to chat page"
           className="flex items-center text-pink-600 hover:text-pink-800 transition focus:outline-none focus:ring-2 focus:ring-pink-500 rounded">
            <ArrowLeft size={20} className="mr-1" aria-hidden="true"/> Back to Chat
          
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-pink-700">
          ⭐ Favorite Q&A
        </h1>
      </motion.header>

      {/* Favorites List */}
      <div className="flex-1 p-4 space-y-4">
        {favorites.length > 0 ? (
          <ul className="space-y-4"
                 aria-label="Saved favorite Q&A list"
          >
          {favorites.map((fav, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="p-4 bg-white rounded-xl shadow-md border border-pink-200"
            >
              <p className="font-semibold text-pink-700">
                <span role="img" aria-hidden="true">🤖</span>{" "}
                <span>{fav.text}</span>
              </p>
            </motion.li>

          ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-6" role="status"
                 aria-live="polite">
            No favorites saved yet. ⭐
          </p>
        )}
      </div>
    </main>
  );
}
