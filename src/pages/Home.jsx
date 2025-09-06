import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [degree, setDegree] = useState("");
  const [semester, setSemester] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [degreesList, setDegreesList] = useState([]);
  const [degreesLoading, setDegreesLoading] = useState(true);
  const [semestersList, setSemestersList] = useState([]);
  const [semestersLoading, setSemestersLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        setDegreesLoading(true);
        const res = await axios.get("/api/degrees");
        
        // Handle different response formats
        if (res.data.degrees && Array.isArray(res.data.degrees)) {
          setDegreesList(res.data.degrees);
        } else if (Array.isArray(res.data)) {
          setDegreesList(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setDegreesList(res.data.data);
        } else {
          console.error("Unexpected API response format:", res.data);
          setError("Unexpected response format from server");
        }
      } catch (err) {
        console.error("Error fetching degrees:", err);
        setError("Failed to load degrees");
      } finally {
        setDegreesLoading(false);
      }
    };
    
    fetchDegrees();
  }, []);

  useEffect(() => {
    if (!degree) {
      setSemestersList([]);
      setSemester("");
      return;
    }

    const fetchSemesters = async () => {
      setSemestersLoading(true);
      try {
        const res = await axios.get(`/api/semesters?degreeId=${degree}`);
        
        // Handle different response formats
        if (res.data.semesters && Array.isArray(res.data.semesters)) {
          setSemestersList(res.data.semesters);
        } else if (Array.isArray(res.data)) {
          setSemestersList(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setSemestersList(res.data.data);
        } else {
          console.error("Unexpected API response format:", res.data);
          setError("Unexpected response format from server");
        }
      } catch (err) {
        console.error("Error fetching semesters:", err);
        setError("Failed to load semesters");
      } finally {
        setSemestersLoading(false);
      }
    };

    fetchSemesters();
  }, [degree]);

  const handleContinue = () => {
    setSubmitted(true);
    if (degree && semester) {
      setLoading(true);
      setTimeout(() => {
        navigate(`/subjects?degree=${encodeURIComponent(degree)}&semester=${encodeURIComponent(semester)}`);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <main className="home-container" aria-label="SmartLearn Hub Homepage">
      <motion.section 
        className="hero py-8 px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold select-none text-[#520842be] ">SmartLearn Hub — Learn Smarter, Not Harder</h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-[#520842be]">
          Empowering students with personalized learning tools, and interactive study materials.
        </p>
      </motion.section>

      <section className="features grid gap-y-6 mt-10 px-6 md:grid-cols-3" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Key Features</h2>
        <Link to="/askai" className="feature-card" aria-labelledby="f1">
          <div className="icon" role="img" aria-label="AI Robot">🤖</div>
          <h2 id="f1" className="font-mono text-[#a01443]">AI-Powered Study Planner</h2>
          <p className="font-mono text-sm">Auto-generate a study plan tailored to your syllabus and pace.</p>
        </Link>

        <Link to="/upload" className="feature-card" aria-labelledby="f2">
          <div className="icon" role="img" aria-label="Upload">📤</div>
          <h2 id="f2" className="font-mono text-[#a01443]">Upload Your Notes</h2>
          <p className="font-mono text-sm">Quickly upload and organize your notes for easy retrieval.</p>
        </Link>

        <Link to="/notes" className="feature-card" aria-labelledby="f3">
          <div className="icon" role="img" aria-label="Books">📚</div>
          <h2 id="f3" className="font-mono text-[#a01443]">Interactive Resources</h2>
          <p className="font-mono text-sm">Practice tests, flashcards, and tutorials to reinforce learning.</p>
        </Link>
      </section>

      <section className="mt-12 px-6" aria-labelledby="degree-selection">
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#c99cb24f] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#4B4B4B] text-center">
            Start by choosing your Degree & Semester
          </h2>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm text-[#4B4B4B]">Degree</span>
              <select
                value={degree}
                onChange={(e) => {
                  setDegree(e.target.value);
                  setSemester("");
                  setError("");
                }}
                className="mt-1 w-full rounded-lg border border-[#D9C4B0] bg-white px-3 py-2 text-[#4B4B4B] 
                         focus:outline-none focus:ring-2 focus:ring-[#D59B99] transition"
              >
                <option value="" disabled>Select degree</option>
                {degreesLoading ? (
                  <option disabled>Loading degrees...</option>
                ) : (
                  degreesList.map((deg) => (
                    <option key={deg._id || deg.id} value={deg._id || deg.id}>
                      {deg.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            
            <label className="block">
              <span className="text-sm text-[#4B4B4B]">Semester</span>
              <select
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setError("");
                }}
                disabled={!degree || semestersLoading}
                className="mt-1 w-full rounded-lg border border-[#D9C4B0] bg-white px-3 py-2 text-[#4B4B4B] 
                         focus:outline-none focus:ring-2 focus:ring-[#D59B99] transition disabled:opacity-50"
              >
                <option value="" disabled>Select semester</option>
                {semestersLoading ? (
                  <option disabled>Loading semesters...</option>
                ) : (
                  semestersList.map((sem) => (
                    <option key={sem._id || sem.id} value={sem._id || sem.id}>
                      {sem.name}
                    </option>
                  ))
                )}
              </select>
            </label>
          </div>
          
          {submitted && (!degree || !semester) && (
            <p className="mt-3 text-sm text-red-600">Please select both Degree and Semester.</p>
          )}

          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleContinue}
              disabled={!degree || !semester || loading}
              className="rounded-xl bg-[#5c1437] px-6 py-2 font-medium text-white shadow 
                       hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                "Continue"
              )}
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;