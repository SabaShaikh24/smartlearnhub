
import { Router } from "express";
import Degree from "../models/Degree.js";
const router = Router();


router.get("/", async (req, res) => {
  try {
    const degrees = await Degree.find();
    console.log("Degrees:", degrees);
    res.status(200).json({ degrees });
  } catch (err) {
    console.error("Error fetching degrees:", err);
    res.status(500).json({ message: "Server error while fetching degrees" });
  }
});

export default router;
