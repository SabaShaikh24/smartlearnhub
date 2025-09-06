import React, { useState, useEffect, useContext } from "react"; 
import { useSearchParams, Link } from "react-router-dom";
import { BookmarksContext } from "../context/BookmarksContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";

export default function Subjects() {
  const [params] = useSearchParams();
  const degree = params.get("degree") || "";
  const semester = params.get("semester") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { bookmarks, toggleBookmark } = useContext(BookmarksContext);
  const [subjectsList, setSubjectsList] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [semesterName, setSemesterName] = useState("");
  const [error, setError] = useState("");
  


  useEffect(() => {
    if (!semester) return;
    setLoading(true);
    setError("");

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`/api/subjects?semesterId=${semester}`);
        
        // Handle different response formats
        if (res.data.subjects && Array.isArray(res.data.subjects)) {
          setSubjectsList(res.data.subjects);
        } else if (Array.isArray(res.data)) {
          setSubjectsList(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setSubjectsList(res.data.data);
        } else {
          console.error("Unexpected API response format:", res.data);
          setError("Unexpected response format from server");
          setSubjectsList([]);
        }

        const semRes = await axios.get(`/api/semesters/${semester}`);
        setSemesterName(semRes.data.name);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
        setSubjectsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [semester]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Safe filtering with optional chaining
  const filtered = subjectsList?.filter((s) => 
    s?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-red-500 text-xl mb-4">Error: {error}</h2>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main role="main" aria-label="Subjects list" className="px-6 sm:px-10 md:px-16 py-10">
      <h1 className="text-2xl font-semibold text-[#4B4B4B]">
        Subjects for {semester ? ` ${semesterName}` : ""}
      </h1>

      <input
        type="text"
        placeholder="Search subjects..."
        className="p-3 rounded-xl border border-gray-300 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search subjects" 
      />

      <div role="list" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          searchTerm.trim() !== "" ? (
            <p className="text-gray-500 mt-4 text-center">
              No results found for{" "}
              <span className="font-semibold">"{searchTerm}"</span>
            </p>
          ) : (
            <p className="text-gray-400 mt-4 text-center">
              No subjects available in this semester.
            </p>
          )
        ) : (
          filtered.map((subj) => {
            const isBookmarked = bookmarks.includes(subj._id); 

            return (
              <div key={subj._id} className="relative" role="listitem"> 
                <Link
                  to={`/subject-detail/${encodeURIComponent(degree)}/${encodeURIComponent(semester)}/${subj._id}`}
                  state={{ 
                       degreeName: degree.name, 
                       semesterName: semester.name 
                  }}
                  className="block p-4 rounded-2xl shadow-md bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  aria-label={`Open details for ${subj.name}`}
                >
                  <p className="font-medium text-[#333] text-lg pr-10">
                    {subj.name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition">
                      {subj.type}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {subj.credits} Credits
                    </span>
                    {subj.mode && (
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                        {subj.mode}
                      </span>
                    )}
                  </div>

                  {subj.description && (
                    <p className="mt-2 text-gray-500 text-sm line-clamp-2">
                      {subj.description}
                    </p>
                  )}
                </Link>

                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(subj._id);
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    isBookmarked
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? "⭐" : "☆"}
                </motion.button>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}