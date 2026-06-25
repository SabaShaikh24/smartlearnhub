/* eslint-disable no-unused-vars */
import express from "express";
import User from "../models/User.js"; 
import {authMiddleware} from "../middleware/auth.js";

const router = express.Router();



router.get("/",authMiddleware, async (req, res) => {
  try {
    
    const userId = req.user.userId; 
    
    const user = await User.findById(userId).select("-password"); 
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


router.put("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, degree } = req.body;

    
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