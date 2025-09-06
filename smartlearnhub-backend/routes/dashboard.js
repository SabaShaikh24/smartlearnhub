// /* eslint-disable no-unused-vars */
// import express from "express";
// import { authMiddleware } from "../middleware/auth.js";
// import Note from "../models/Note.js";
// import Upload from "../models/Upload.js";
// import Bookmark from "../models/Bookmark.js";
// import AIChat from "../models/AIChat.js";

// const router = express.Router();

// // GET /api/dashboard
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     // Fetch counts from your databases
//     const notesCount = await Note.countDocuments({ user: userId });
//     const uploadsCount = await Upload.countDocuments({ user: userId });
//     const bookmarksCount = await Bookmark.countDocuments({ user: userId });
//     const aiChatsCount = await AIChat.countDocuments({ user: userId });

//     // Fetch recent activity (example: last 5 notes)
//     const recentActivity = await Note.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select("title createdAt");

//     res.json({
//       stats: {
//         notesCount,
//         uploadsCount,
//         bookmarksCount,
//         aiChatsCount,
//       },
//       recentActivity: recentActivity.map(activity => ({
//         action: `Created note: ${activity.title}`,
//         date: activity.createdAt,
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;