import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/bookmarks - Get user's bookmarks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("bookmarks");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/bookmarks - Add or remove a bookmark
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subjectId } = req.body;
    
    if (!subjectId) {
      return res.status(400).json({ error: "Subject ID is required" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(subjectId);
    
    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(id => id !== subjectId);
    } else {
      // Add bookmark
      user.bookmarks.push(subjectId);
    }

    await user.save();
    res.json({ 
      bookmarks: user.bookmarks,
      action: isBookmarked ? "removed" : "added" 
    });
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;