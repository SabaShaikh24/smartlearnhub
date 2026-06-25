/* eslint-disable no-undef */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from './routes/auth.js';
import degreesRouter from "./routes/degrees.routes.js";
import semestersRouter from "./routes/semesters.routes.js";
import subjectsRouter from "./routes/subjects.routes.js";
import notesRoutes from "./routes/notes.js";
import uploadRoutes from './routes/upload.js';
import youtubeRoutes from './routes/youtube.js';
import tipRoutes from './routes/tips.js';
import chatRoutes from './routes/chat.routes.js';
import newsletterRoutes from './routes/newsletter.js';
import userRoutes from './routes/user.js';
import bookmarksRoutes from "./routes/bookmarks.js";
import contactRoutes from './routes/contact.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/degrees", degreesRouter);
app.use("/api/semesters", semestersRouter);
app.use("/api/subjects", subjectsRouter);
app.use('/api/notes', notesRoutes);
app.use('/api/notes', uploadRoutes); 
app.use('/api/youtube', youtubeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/tips', tipRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api', newsletterRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use('/api/contact', contactRoutes);





app.get("/api/test", (req, res) => res.json({ message: "API is working!" }));



app.get("/", (req, res) => res.send("Backend is running"));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error ❌:", err));


app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
