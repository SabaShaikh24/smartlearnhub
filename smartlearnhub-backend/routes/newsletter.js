/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from "express";
import Subscriber from "../models/Subscriber.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Test email route
router.post("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      secure: false,
      port: 465,
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: '"SmartLearnHub" <shaikhsaba2483@gmail.com>',
      to: "shaikhsaba16786@gmail.com",
      subject: "TEST",
      text: "Nodemailer test"
    });
    
    res.json({ message: "Test email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ error: "Only Gmail addresses are allowed" });
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      secure: false,
      port: 465,
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: '"SmartLearnHub" <shaikhsaba2483@gmail.com>',
      to: email,
      subject: 'Welcome to SmartLearnHub! 🎓',
      html: '<h1>Thanks for subscribing!</h1><p>You will receive study tips and updates.</p>'
    });

    res.json({ message: "Subscribed successfully!" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;