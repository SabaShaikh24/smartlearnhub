/* eslint-disable no-unused-vars */
import express from "express";
import User from "../models/User.js"; // You'll need a User model
import {authMiddleware} from "../middleware/auth.js";

const router = express.Router();


// GET /api/user - Get user profile data
router.get("/",authMiddleware, async (req, res) => {
  try {
    // TODO: Get user ID from authentication middleware
    const userId = req.user.userId; 
    
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      degree: user.degree,
      joinedAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/user - Update user profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, degree } = req.body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, degree },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


export default router;