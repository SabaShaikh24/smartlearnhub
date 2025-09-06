import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BookmarksContext } from "../context/BookmarksContext";
import axios from "axios";
import AskAI from "./AskAI";

const SubjectDetail = () => {
  // eslint-disable-next-line no-unused-vars
  const { degree, semester, id } = useParams();
  const [activeTab, setActiveTab] = useState("notes");
  const { bookmarks, toggleBookmark } = useContext(BookmarksContext);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [uploadedNotesLoading, setUploadedNotesLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [newTip, setNewTip] = useState("");

  // Fetch tips when tips tab is active
useEffect(() => {
  if (activeTab === "tips" && subject) {
    fetchTips();
  }
}, [activeTab, subject]);

const fetchTips = async () => {
  if (!subject) return;
  
  setTipsLoading(true);
  try {
    const response = await axios.get(`/api/tips/${subject._id}`);
    if (response.data.success) {
      setTips(response.data.tips);
    }
  } catch (err) {
    console.error("Error fetching tips:", err);
  } finally {
    setTipsLoading(false);
  }
};

  // Fetch YouTube videos when videos tab is active
useEffect(() => {
  if (activeTab === "videos" && subject) {
    fetchYouTubeVideos();
  }
}, [activeTab, subject]);

const fetchYouTubeVideos = async () => {
  if (!subject) return;
  
  setVideosLoading(true);
  setVideosError("");
  try {
    const response = await axios.get(`/api/youtube/search?subject=${encodeURIComponent(subject.name)}`);
    
    if (response.data.success) {
      setYoutubeVideos(response.data.videos);
    } else {
      setVideosError("Failed to load videos");
    }
  } catch (err) {
    console.error("Error fetching YouTube videos:", err);
    setVideosError("Failed to load videos: " + (err.response?.data?.error || err.message));
  } finally {
    setVideosLoading(false);
  }
};

  // Fetch subject details
  useEffect(() => {
    if (!id) return;

    const fetchSubject = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("Fetching subject with ID:", id);
        
        const res = await axios.get(`/api/subjects/${id}`);
        console.log("API response:", res.data);
        
        if (res.data.subject) {
          setSubject(res.data.subject);
        } else if (res.data) {
          setSubject(res.data);
        } else {
          setError("Unexpected response format from server");
        }
      } catch (err) {
        console.error("Error fetching subject:", err);
        setError("Failed to load subject: " + (err.response?.data?.error || err.message));
        setSubject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  // Fetch notes when the notes tab is active
  useEffect(() => {
    if (activeTab === "notes" && subject) {
      fetchNotes();
    }
  }, [activeTab, subject]);

  const fetchNotes = async () => {
    if (!subject) return;
    
    setNotesLoading(true);
    setUploadedNotesLoading(true);
    try {
      // Fetch API notes
      const notesResponse = await axios.get("/api/notes", {
        params: {
          subjectId: subject._id,
          search: ""
        }
      });
      
      if (notesResponse.data.success) {
        setNotes(notesResponse.data.notes);
      }

      // Fetch uploaded notes (peer notes)
      const token = localStorage.getItem("token");
      const uploadedResponse = await axios.get(`/api/notes/uploaded-notes?subjectId=${subject._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (uploadedResponse.data.success) {
        setUploadedNotes(uploadedResponse.data.notes);
      }
      
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setNotesLoading(false);
      setUploadedNotesLoading(false);
    }
  };

  const handleViewNote = async (note) => {
    try {
      // For external API notes
      if (note.sourceType === 'api' || note.source === 'api') {
        window.open(note.link, '_blank');
        return;
      }
      
      // For peer-uploaded notes
      if (note.sourceType === 'peer_upload' || note.source === 'peer') {
        // Use the API view route
        window.open(`/api/notes/view/${note._id}`, '_blank');
        return;
      }
      
      // Fallback for older format
      if (note.link) {
        window.open(note.link, '_blank');
      }
    } catch (err) {
      console.error("Error viewing note:", err);
    }
  };

   const submitTip = async () => {
  if (!newTip.trim()) return;
  
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post('/api/tips', {
      content: newTip,
      subjectId: subject._id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setTips([response.data.tip, ...tips]);
      setNewTip("");
    }
  } catch (err) {
    console.error("Error submitting tip:", err);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p className="ml-4 text-gray-600">Loading subject details...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Subject Not Found"}
        </h2>
        <Link
          to="/subjects"
          className="mt-4 px-4 py-2 bg-[#e4548e] text-white rounded-lg shadow hover:bg-[#99335C] transition"
        >
          Back to Subjects
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(subject._id);

  const tabs = [
    { id: "notes", label: "📘 Notes" },
    { id: "videos", label: "🎥 Videos" },
    { id: "chatgpt", label: "🤖 ChatGPT" },
    { id: "tips", label: "💡 Tips" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#a01443ec] mb-6">
        {subject.name}
      </h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#a01443ec] font-medium">
          
        </p>
        
        <motion.button
          onClick={() => toggleBookmark(subject._id)}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full transition-colors ${
            isBookmarked
              ? "bg-yellow-400 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <motion.span
            animate={{ scale: isBookmarked ? 1.25 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            {isBookmarked ? "⭐" : "☆"}
          </motion.span>
        </motion.button>
      </div>

      <div className="mt-4 mb-8 bg-[#fff0f5] border border-[#660029]/30 rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-[#660029]"> 📖 Subject Information </h3>
        <p className="mt-2 text-[#4a1c40] text-sm leading-relaxed">
          <span className="font-medium">Type:</span> {subject.type || "Not provided"}<br />
          <span className="font-medium">Credits:</span> {subject.credits || "Not specified"}<br />
          <span className="font-medium">Mode:</span> {subject.mode || "Not provided"}<br/>
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center space-x-3 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-medium relative overflow-hidden transition ${
              activeTab === tab.id
                ? "text-white"
                : "text-[#cb77a1] border border-[#CC668F] hover:border-[#FF99BB]"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabHighlight"
                className="absolute inset-0 bg-gradient-to-r from-[#a15070] to-[#FF99BB] rounded-full shadow-md"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-[#bb5c8c8a] text-[#a01443ec] shadow-xl rounded-2xl p-6 min-h-[250px]"
        >
          {activeTab === "notes" && (
            <div className="space-y-6">
              {notesLoading || uploadedNotesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <p className="ml-3 text-gray-600">Loading notes...</p>
                </div>
              ) : notes.length > 0 || uploadedNotes.length > 0 ? (
                <>
                  {/* External Resources (API Notes) */}
                  {notes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#660029] mb-4 border-b border-[#a01443ec] pb-2">
                        📚 External Resources
                      </h3>
                      <div className="space-y-4">
                        {notes.map((note, i) => (
                          <div key={`api-${i}`} className="bg-white rounded-lg shadow p-4 border border-[#FF99BB]">
                            <h3 className="text-lg font-semibold text-[#660029]">{note.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Source: <span className="font-medium">{note.uploader}</span> • 
                              Date: {note.date} • 
                              Topic: {note.topic || "General"}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">{note.description}</p>
                            <button
                              onClick={() => handleViewNote(note)}
                              className="px-3 py-1 bg-[#a01443ec] text-white rounded-lg hover:bg-[#660029] transition text-sm"
                            >
                              View Online
                            </button>
                            <span className="ml-3 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                              External Resource
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Peer Uploads */}
                  {uploadedNotes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#660029] mb-4 border-b border-[#a01443ec] pb-2">
                        👥 Peer Uploads
                      </h3>
                      <div className="space-y-4">
                        {uploadedNotes.map((note, i) => (
                          <div key={`uploaded-${i}`} className="bg-white rounded-lg shadow p-4 border border-[#FF99BB]">
                            <h3 className="text-lg font-semibold text-[#660029]">{note.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Uploaded by: <span className="font-medium">{note.uploader}</span> • 
                              Date: {note.date} • 
                              Topic: {note.topic || "General"}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">{note.description}</p>
                            <button
                              onClick={() => handleViewNote(note)}
                              className="px-3 py-1 bg-[#a01443ec] text-white rounded-lg hover:bg-[#660029] transition text-sm"
                            >
                              {note.originalFileName?.endsWith('.pdf') ? 'View' : 'Download'}
                            </button>
                            <span className="ml-3 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                              Peer Uploaded
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No notes available for this subject.</p>
                  <Link
                    to="/notes"
                    className="px-4 py-2 bg-[#a01443ec] text-white rounded-lg hover:bg-[#660029] transition"
                  >
                    Browse All Notes
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Other tabs remain the same */}
          {activeTab === "videos" && (
  <div className="space-y-4">
    {videosLoading ? (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        <p className="ml-3 text-gray-600">Loading videos...</p>
      </div>
    ) : videosError ? (
      <div className="text-center py-8 text-red-500">
        <p>{videosError}</p>
        <button 
          onClick={fetchYouTubeVideos}
          className="mt-3 px-4 py-2 bg-[#a01443ec] text-white rounded-lg hover:bg-[#660029] transition"
        >
          Try Again
        </button>
      </div>
    ) : youtubeVideos.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {youtubeVideos.map((video, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#FF99BB]">
            <div className="relative pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
              <div className="relative pb-[56.25%] h-0 bg-gray-200 rounded-lg">
  <img 
    src={video.thumbnail} 
    alt={video.title}
    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div 
      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full cursor-pointer transition"
      onClick={() => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
        window.open(youtubeUrl, '_blank')}}
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
  </div>
</div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-[#660029] text-sm line-clamp-2 mb-1">
                {video.title}
              </h4>
              <p className="text-xs text-gray-600">By: {video.channel}</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block px-3 py-1 bg-[#a01443ec] text-white text-xs rounded hover:bg-[#660029] transition"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600 py-4">No videos found for this subject.</p>
    )}
  </div>
)}

          {activeTab === "chatgpt" && (
           <div className="max-h-[300px] overflow-y-auto">
              <AskAI />
         </div>
         )}

          {activeTab === "tips" && (
  <div className="space-y-4">
    {/* Tip Input Form */}
    <div className="bg-white p-4 rounded-lg shadow">
      <textarea
        value={newTip}
        onChange={(e) => setNewTip(e.target.value)}
        placeholder="Share your study tip for this subject..."
        className="w-full p-3 border border-[#FF99BB] rounded-lg focus:ring-2 focus:ring-[#a01443ec]"
        rows="3"
      />
      <button
        onClick={submitTip}
        className="mt-2 px-4 py-2 bg-[#a01443ec] text-white rounded-lg hover:bg-[#660029] transition"
      >
        Submit Tip
      </button>
    </div>

    {/* Tips List */}
    {tipsLoading ? (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
      </div>
    ) : tips.length > 0 ? (
      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip._id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800">{tip.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              - By {tip.user?.name || 'Anonymous'}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600 py-4">No tips yet. Be the first to share!</p>
    )}
  </div>
)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SubjectDetail;