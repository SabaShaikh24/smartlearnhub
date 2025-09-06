import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [notes, setNotes] = useState([]);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedNotesLoading, setUploadedNotesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  // Fetch subjects from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const response = await axios.get("/api/subjects/all");
        
        if (response.data.subjects && Array.isArray(response.data.subjects)) {
          setSubjects(response.data.subjects);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Unexpected response format from server");
          setSubjects([]);
        }
      } catch (err) {
        setError("Failed to load subjects");
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch structured notes based on selected subject and search query
  useEffect(() => {
    const fetchNotes = async () => {
      if (selectedSubject === "all") {
        setNotes([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get("/api/notes", {
          params: {
            subjectId: selectedSubject,
            search: searchQuery
          }
        });
        // Add a flag to identify API-sourced notes
        const notesWithSource = response.data.notes.map(note => ({
          ...note,
          sourceType: 'api'
        }));
        setNotes(notesWithSource);
      } catch (err) {
        setError("Failed to load structured notes");
        console.error("Error fetching structured notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSubject, searchQuery]);

  // Fetch uploaded notes when subject changes
  useEffect(() => {
    const fetchUploadedNotes = async () => {
      if (selectedSubject === "all") {
        setUploadedNotes([]);
        return;
      }
      
      setUploadedNotesLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/notes/uploaded-notes?subjectId=${selectedSubject}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          // Add a flag to identify peer-uploaded notes
          const uploadedNotesWithSource = response.data.notes.map(note => ({
            ...note,
            sourceType: 'peer_upload',
            // Try multiple possible URL formats for viewing
            viewUrl: note.filePath ? `/uploads/${note.filePath}` : null,
  
            directUrl: note.filePath ? note.filePath : null
          }));
          setUploadedNotes(uploadedNotesWithSource);
          setDebugInfo(`Found ${response.data.notes.length} uploaded notes`);
        } else {
          console.error("Failed to fetch uploaded notes:", response.data);
          setError("Failed to load uploaded notes");
        }
      } catch (err) {
        console.error("Error fetching uploaded notes:", err);
        setError("Error loading uploaded notes. Check console for details.");
      } finally {
        setUploadedNotesLoading(false);
      }
    };

    fetchUploadedNotes();
  }, [selectedSubject]);

  // Handle file view
  const handleView = async (note) => {
    console.log('Trying to view note with ID:', note._id);
    try {
      setDebugInfo(`Trying to view: ${note.title}`);
      
      // For external API notes
      if (note.sourceType === 'api') {
        window.open(note.link, '_blank');
        return;
      }
      
      // For peer-uploaded notes - try multiple URL formats
      if (note.sourceType === 'peer_upload') {
      // This opens the API route which will serve the file
      window.open(`/api/notes/view/${note._id}`, '_blank');
      return;
    }
    setError("No valid view URL available for this file");
      
      
      
      
      
    } catch (err) {
      setError("Failed to view file: " + err.message);
      console.error("View error:", err);
    }
  };

  // Combine both note types for display
  const allNotes = [...notes, ...uploadedNotes];

  // Function to get appropriate badge based on source type
  // eslint-disable-next-line no-unused-vars
  const getSourceBadge = (note) => {
    if (note.sourceType === 'api') {
      return (
        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
          External Resource
        </span>
      );
    } else if (note.sourceType === 'peer_upload') {
      return (
        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
          Peer Uploaded
        </span>
      );
    }
    return null;
  };

  // Debug function to check note URLs
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8 px-4">
      <main className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 relative">
        {/* Header with Upload Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-800">
            📘 All Notes Library
          </h2>
          <Link
            to="/upload"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition transform hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload Notes
          </Link>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            <div className="flex justify-between items-center">
              <span>{debugInfo}</span>
              <button 
                onClick={() => setDebugInfo("")}
                className="text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search notes by title..."
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-pink-900 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 absolute left-3 top-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none text-pink-900"
            disabled={subjectsLoading}
          >
            <option value="all">All Subjects</option>
            {Array.isArray(subjects) && subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Error States */}
        {subjectsLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        )}
        {loading && <p className="text-pink-600">Loading structured notes...</p>}
        {uploadedNotesLoading && <p className="text-pink-600">Loading uploaded notes...</p>}
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Notes Counter */}
        {!loading && !uploadedNotesLoading && selectedSubject !== "all" && (
          <div className="mb-4 text-pink-700 bg-pink-50 p-3 rounded-lg">
            <p className="font-medium">
              Showing {allNotes.length} notes ({notes.length} structured + {uploadedNotes.length} uploaded)
            </p>
          </div>
        )}

        {/* Notes List */}
        {!loading && !uploadedNotesLoading && allNotes.length > 0 ? (
          <ul className="space-y-4">
            {allNotes.map((note, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg shadow hover:shadow-md transition duration-200 ${
                  note.sourceType === 'api' 
                    ? "bg-pink-50 border-l-4 border-pink-500" 
                    : "bg-purple-50 border-l-4 border-purple-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg md:text-xl mb-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {note.description}
                    </p>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2 mb-2">
                      <span className="bg-gray-200 px-2 py-1 rounded-full">
                        <span className="font-medium">Source:</span> {note.source || note.uploader || "Unknown"}
                      </span>
                      <span className="bg-gray-200 px-2 py-1 rounded-full">
                        <span className="font-medium">Date:</span> {note.date || "N/A"}
                      </span>
                      <span className="bg-gray-200 px-2 py-1 rounded-full">
                        <span className="font-medium">Topic:</span> {note.topic || "General"}
                      </span>
                    </div>
                    
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        
                        handleView(note)}
                      className={`px-3 py-2 text-white rounded text-sm transition flex items-center ${
                        note.sourceType === 'api' 
                          ? "bg-pink-600 hover:bg-pink-700" 
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      View
                    </button>
                    
                    
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !uploadedNotesLoading && selectedSubject !== "all" && 
          <div className="bg-pink-50 p-6 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-pink-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-pink-600">No notes found. Try selecting a different subject or upload notes.</p>
          </div>
        )}

        {/* Instructions when no subject selected */}
        {selectedSubject === "all" && (
          <div className="bg-pink-50 p-6 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-pink-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">
              Select a Subject to View Notes
            </h3>
            <p className="text-pink-600">
              Choose a subject from the dropdown above to see available notes and resources.
            </p>
          </div>
        )}

        

        {/* Floating Upload Button (Mobile) */}
        <Link
          to="/upload"
          className="fixed bottom-6 right-6 bg-pink-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl hover:bg-pink-700 transition transform hover:scale-110 md:hidden z-10"
        >
          <span className="pointer-events-auto">+</span>
        </Link>
      </main>
    </div>
  );
};

export default Notes;