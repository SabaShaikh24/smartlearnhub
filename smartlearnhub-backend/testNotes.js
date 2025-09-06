import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Note from './models/Note.js';

dotenv.config();

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌:", err);
  }
};

const createTestNote = async () => {
  try {
    // Fetch existing user and subject from DB
    const user = await User.findOne(); 
    const subject = await Subject.findOne();

    const note = new Note({
      title: "Sample Note",
      content: "This is a test note.",
      user: user._id,
      subject: subject._id,
    });

    await note.save();
    console.log("Test note created ✅");
  } catch (err) {
    console.error("Error creating note ❌:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => createTestNote());
