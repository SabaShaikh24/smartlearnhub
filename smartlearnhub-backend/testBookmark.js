import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";
import Note from "./models/Note.js";
import Bookmark from "./models/Bookmark.js";

dotenv.config();

const connectDB = async () => {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected ✅");
};

const createTestBookmark = async () => {
  // 1. Create a test user (or fetch existing one)
  let user = await User.findOne({ email: "testuser@example.com" });
  if (!user) {
    user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "hashedpassword123" // make sure in real app it’s hashed
    });
    await user.save();
    console.log("Test user created ✅");
  }

  // 2. Create a test note (or fetch existing one)
  let note = await Note.findOne({ title: "Sample Note" });
  if (!note) {
    note = new Note({
      title: "Sample Note",
      content: "This is a test note for bookmark.",
      subject: "Math"
    });
    await note.save();
    console.log("Test note created ✅");
  }

  // 3. Create a bookmark that links user + note
  const bookmark = new Bookmark({
    user: user._id,
    note: note._id
  });
  await bookmark.save();

  console.log("✅ Bookmark created:", bookmark);

  mongoose.connection.close();
};

connectDB().then(() => createTestBookmark());
