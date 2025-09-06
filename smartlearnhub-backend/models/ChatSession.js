// models/ChatSession.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // links to User
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
