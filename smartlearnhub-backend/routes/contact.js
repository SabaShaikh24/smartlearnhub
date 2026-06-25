import express from 'express';
import Message from '../models/Message.js'; 

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    
    const newMessage = new Message({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });

    
    const savedMessage = await newMessage.save();
    
    
    res.status(201).json({
      success: true,
      message: 'Message received successfully!',
      data: savedMessage
    });

  } catch (error) {
    
    console.error('Error saving message:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

export default router;