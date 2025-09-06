/* eslint-disable no-unused-vars */
// routes/subjects.routes.js
import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();


router.get("/all-subjects", async (req, res) => {
  try {
    const subjects = await Subject.find(); 
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/subjects?semesterId=...
router.get("/", async (req, res) => {
  try {
    const { semesterId } = req.query;

    if (!semesterId) {
      return res.status(400).json({ 
        success: false,
        error: "semesterId is required" 
      });
    }

    const subjects = await Subject.find({ semesterId })
      .populate("semesterId", "name")
      .sort({ order: 1 });

    res.json({ 
      success: true,
      data: subjects // Changed from "subjects" to "data"
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
});

// GET /api/subjects/all - Get all subjects
router.get("/all", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json({ subjects });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to load subjects" 
    });
  }
});

// Add this to your subjects routes
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the subject by ID
    const subject = await Subject.findById(id);
    
    
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    
    res.json({ subject });
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ error: "Failed to load subject" });
  }
});

export default router;