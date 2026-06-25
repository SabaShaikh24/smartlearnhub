/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // JWT token

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.subjects) setSubjects(res.data.subjects);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
      }
    };
    fetchSubjects();
  }, [token]);

  const handleFileChange = (e) => {
    console.log("Selected:", selected.name, selected.type);
  const selected = e.target.files[0];
  if (!selected) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(selected.type)) {
    setError("Only PDF, DOC and DOCX files are allowed.");
    e.target.value = "";
    return;
  }

  setError("");
  setFile(selected);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !subjectId) {
      setError("Please fill all required fields");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("subjectId", subjectId);
      console.log(axios.defaults.baseURL);
console.log("/api/notes/upload");
      const res = await axios.post("/api/notes/upload", formData, {
        
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          
        },
      });

      setSuccess("✅ File uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setSubjectId("");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Failed to upload file");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#ebe4f8] to-[#9a7389] p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-pink-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-200 bg-clip-text text-transparent">
          Upload Notes
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject *</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none"
            >
              <option value="">Select a subject</option>
              {subjects.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
  File *
</label>
<p className="text-xs text-gray-500 mt-1 mb-2">
  Only PDF (.pdf), DOC (.doc) and DOCX (.docx) files are allowed. Max size: 20 MB.
</p>
            <input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={handleFileChange}
  className="mt-1"
/>
          </div>

          {/* Messages */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <UploadIcon />}
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
