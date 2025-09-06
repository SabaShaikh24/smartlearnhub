// testChatSession.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChatSession from './models/ChatSession.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected ✅");
};

const createTestChat = async () => {
  try {
    // Fetch an existing user (replace with your test user email)
    const user = await User.findOne({ email: "john@example.com" });
    if (!user) {
      console.log("Test user not found. Please create a test user first.");
      return;
    }

    // Create a dummy chat session
    const chat = new ChatSession({
      user: user._id,
      question: "What is recursion?",
      answer: "Recursion is a function calling itself.",
    });

    await chat.save();
    console.log("Test chat session created ✅");
  } catch (err) {
    console.error("Error creating chat session ❌:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => createTestChat());
