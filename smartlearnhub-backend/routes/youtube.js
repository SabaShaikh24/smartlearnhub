/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ error: 'Subject parameter required' });

    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'snippet',
          q: `${subject} BSc CS IT lecture tutorial education`,
          type: 'video',
          maxResults: 6,
          key: apiKey,
          safeSearch: 'strict'
        }
      }
    );

    // Improved filtering
    const availableVideos = response.data.items.filter(item => {
      const title = item.snippet.title.toLowerCase();
      return !(
        title.includes('deleted video') ||
        title.includes('private video') || 
        title.includes('unavailable') ||
        title.includes('content removed') ||
        item.snippet.title === "Deleted video" ||
        item.snippet.title === "Private video"
      );
    });

    const videos = availableVideos.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.json({ success: true, videos });
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

export default router;