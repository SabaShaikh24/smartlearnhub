// routes/semesters.routes.js
import express from "express";
import Semester from "../models/Semester.js";

const router = express.Router();

// GET /api/semesters?degreeId=...
router.get("/", async (req, res) => {
  try {
    const { degreeId } = req.query; // get ?degreeId=... from URL

    if (!degreeId) {
      return res.status(400).json({ error: "degreeId is required" });
    }

    // Find semesters that belong to this degree
    const semesters = await Semester.find({ degreeId }).sort({ order: 1 });

    res.json({semesters}); // send semesters back as JSON
  } catch (error) {
    console.error("Error fetching semesters:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) return res.status(404).json({ error: "Semester not found" });
    res.json({ name: semester.name });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
