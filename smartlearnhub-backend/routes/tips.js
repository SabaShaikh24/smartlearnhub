import express from 'express';
import Tip from '../models/Tip.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get tips for a subject
router.get('/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const tips = await Tip.find({ subject: subjectId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, tips });
  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

// Submit a new tip (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, subjectId } = req.body;
    const userId = req.user.userId;

    if (!content || !subjectId) {
      return res.status(400).json({ error: 'Content and subject ID are required' });
    }

    const newTip = new Tip({
      content,
      subject: subjectId,
      user: userId
    });

    const savedTip = await newTip.save();
    await savedTip.populate('user', 'name');

    res.status(201).json({ success: true, tip: savedTip });
  } catch (error) {
    console.error('Error creating tip:', error);
    res.status(500).json({ error: 'Failed to create tip' });
  }
});

export default router;