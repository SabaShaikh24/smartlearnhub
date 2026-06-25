/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const BookmarksContext = createContext({
  bookmarks: [],
  toggleBookmark: () => {},
  loading: true
});

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from backend on component mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (subjectId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Optimistic UI update (instant response)
      setBookmarks(prev => 
        prev.includes(subjectId) 
          ? prev.filter(id => id !== subjectId) 
          : [...prev, subjectId]
      );
      
      // Sync with backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subjectId })
      });
      
      // Revert if API call fails
      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }
      
      const data = await response.json();
      setBookmarks(data.bookmarks); // Ensure sync with server
      
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert on error
      setBookmarks(prev => 
        prev.includes(subjectId) 
          ? prev.filter(id => id !== subjectId) 
          : [...prev, subjectId]
      );
    }
  };

  const value = useMemo(() => ({ 
    bookmarks, 
    toggleBookmark, 
    loading 
  }), [bookmarks, loading]);

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

// Custom hook for easier usage
export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};