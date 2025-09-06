import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';

dotenv.config();

// Define User schema

// eslint-disable-next-line no-undef
console.log("MONGO_URI:", process.env.MONGO_URI);
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌:", err);
  }
};

// Create a test user
const createTestUser = async () => {
  try {
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });
    await user.save();
    console.log("Test user created successfully ✅");
  } catch (err) {
    console.error("Error creating user ❌:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the functions
connectDB().then(() => createTestUser());
