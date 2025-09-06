import express from 'express';
import Message from '../models/Message.js'; // Import your model

const router = express.Router();

// POST endpoint to handle form submissions
router.post('/', async (req, res) => {
  try {
    // Create a new message from the request body
    const newMessage = new Message({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });

    // Save to MongoDB
    const savedMessage = await newMessage.save();
    
    // Send success response
    res.status(201).json({
      success: true,
      message: 'Message received successfully!',
      data: savedMessage
    });

  } catch (error) {
    // Handle errors
    console.error('Error saving message:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

export default router;