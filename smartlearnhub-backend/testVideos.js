import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';

dotenv.config();

const connectDB = async () => {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected ✅");
};

const createTestVideo = async () => {
  const testVideo = new Video({
    title: "Introduction to Math",
    url: "https://youtube.com/samplevideo",
    subject: '68b050a1ac7a1820e9371d34', 
    description: "Basic math concepts explained"
  });

  await testVideo.save();
  console.log("Test video created ✅");
  mongoose.connection.close();
};

connectDB().then(() => createTestVideo());
