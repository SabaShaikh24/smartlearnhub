import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarksContext";

export default function Bookmarks() {
  const { bookmarks, loading } = useBookmarks();
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/subjects/all-subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const bookmarkedSubjects = useMemo(() => {
    const out = [];
    
    if (Array.isArray(subjects)) {
      subjects.forEach((subject) => {
        if (bookmarks.includes(subject._id)) {
          out.push({
            ...subject,
            id: subject._id,
            degree: subject.degree || "unknown-degree",
            semester: subject.semester || subject.semesterId?.name || "unknown-semester"
          });
        }
      });
    }
    
    return out;
  }, [bookmarks, subjects]);

  if (loading || subjectsLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="px-4 py-2 rounded-2xl bg-purple-100 text-gray-500 text-sm animate-pulse">
          Loading bookmarks...
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-[#a01443ec] mb-6 text-center">
        ⭐ My Bookmarks
      </h1>
      
      {bookmarkedSubjects.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-inner">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            No bookmarks yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Save your favorite subjects for quick access! Click the bookmark icon ★ 
            on any subject to add it here.
          </p>
          
           Hurry Bookmark the Subject for Access
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedSubjects.map((subj) => (
            <Link
              key={subj._id}
              to={`/subject-detail/${encodeURIComponent(subj.degree)}/${encodeURIComponent(subj.semester)}/${subj._id}`}
              className="block p-4 rounded-2xl shadow-md bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e4548e]" 
            >
              <p className="font-medium text-[#333] text-lg">{subj.name}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">{subj.type}</span>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">{subj.credits} Credits</span>
                {subj.mode && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">{subj.mode}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}