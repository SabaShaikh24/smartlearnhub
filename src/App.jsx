import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { scroller } from "react-scroll";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Newsletter from "./components/NewsLetter";
import Loader from "./components/Loader";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import NotesDetail from "./pages/NotesDetail";
import Upload from "./pages/Upload";
import AskAI from "./pages/AskAI";
// import { Dashboard } from '/src/pages/Dashboard.jsx';
import Privacy from "./pages/Privacy";
import TermsConditions from "./pages/TermsConditions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Error404 from "./pages/Error404";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import Bookmarks from "./pages/Bookmarks";
import FavoritesPage from "./pages/FavoritesPage";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { HashRouter as Router } from 'react-router-dom';

import { UserProvider, UserContext } from "./Context/UserContext";
import "./index.css";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    scroller.scrollTo("top-element", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }, [pathname]);

  return null;
};

// Routes that need access to user context
const AppRoutes = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/notes/:id" element={<ProtectedRoute><NotesDetail /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/askai" element={<ProtectedRoute><AskAI /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsconditions" element={<TermsConditions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/subject-detail/:degree/:semester/:id" element={<SubjectDetail />} />
        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Newsletter />
      <Footer />
    </>
  );
};

const App = () => {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) return <Loader />;

  return (
    <UserProvider>
      <div className="pt-16" name="top-element">
        <AppRoutes />
      </div>
    </UserProvider>
  );
};

export default App;
