/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Degree from './models/Degree.js';
import Semester from './models/Semester.js';
import Subject from './models/Subject.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌", err);
  }
};

const createData = async () => {
  try {
    const degree = new Degree({ name: "B.Tech", duration: 4 });
    await degree.save();

    const semester1 = new Semester({ degree: degree._id, number: 1 });
    await semester1.save();

    const subject = new Subject({ name: "Computer Science 101", semester: semester1._id, code: "CS101" });
    await subject.save();

    console.log("Sample degree, semester, and subject created ✅");
  } catch (err) {
    console.error("Error creating data ❌", err.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => createData());
