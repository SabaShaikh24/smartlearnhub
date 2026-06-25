import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  image: {
    type: String, 
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  favorite: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('AIChat', aiChatSchema);