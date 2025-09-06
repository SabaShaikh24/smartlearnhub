
/* eslint-disable no-undef */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import Note from '../models/Note.js';
import Subject from '../models/Subject.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js'; // ADD THIS IMPORT
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Upload from '../models/Upload.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/view/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    
    // Find the note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Construct the full file path
    const filePath = path.join(__dirname, '..', 'uploads', note.filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Set appropriate headers based on file type
    const ext = path.extname(note.originalFileName).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain'
    };

    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${note.originalFileName}"`);
    
    // Stream the file
    res.sendFile(filePath);

  } catch (err) {
    console.error('Error serving file:', err);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// ------------------------
// 1. Ensure uploads folder exists
// ------------------------
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ------------------------
// 2. Configure Multer
// ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    ),
});

const allowedMimes = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/octet-stream',
];

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, DOC and DOCX files are allowed'));
  },
});

// ------------------------
// 3. Upload Route
// ------------------------
router.post(
  '/upload',
  authMiddleware,
  async (req, res, next) => { // Make this async
    try {
      // DEBUG: Check what's in req.user
      console.log('Auth user data:', req.user);
      
      // Fetch the complete user document from database
      const user = await User.findById(req.user.userId); // Assuming your JWT has userId
      
      if (!user) {
        return res.status(401).json({ error: 'User not found in database' });
      }
      
      // Add the full user object to the request
      req.authenticatedUser = user;
      
      // Multer wrapper to catch errors
      upload.single('file')(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
          }
          return res.status(400).json({ error: err.message });
        }
        next();
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Server error during authentication' });
    }
  },
  async (req, res) => {
    try {
      console.log('--- Upload Request ---');
      console.log('User ID:', req.authenticatedUser._id); // Use the fetched user
      console.log('Body:', req.body);
      console.log('File:', req.file);

      // 1. Validate user - now using the fetched user
      const userId = req.authenticatedUser._id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized: user not found' });

      // 2. Validate title and subjectId
      const { title, description, subjectId } = req.body;
      if (!title || !subjectId)
        return res.status(400).json({ error: 'Title and subject are required' });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      // 3. Validate subjectId format
      if (!mongoose.Types.ObjectId.isValid(subjectId))
        return res.status(400).json({ error: 'Invalid subjectId' });

      // 4. Check if subject exists
      const subject = await Subject.findById(subjectId);
      if (!subject) return res.status(404).json({ error: 'Subject not found' });

      // 5. Create new Note
      const newNote = new Note({
        title,
        content: description || 'No description provided',
        user: userId,
        subject: subjectId,
        filePath: req.file.filename,
        originalFileName: req.file.originalname,
        source: 'Manual',
      });
      

      // 6. Save to DB
      const savedNote = await newNote.save();
      console.log('Note saved successfully:', savedNote._id);

      return res.status(201).json({ message: 'File uploaded successfully', note: savedNote });
    } catch (err) {
      console.error('Upload handler error:', err);
      return res.status(500).json({ error: 'Server error while uploading' });
    }
  }
);

export default router;