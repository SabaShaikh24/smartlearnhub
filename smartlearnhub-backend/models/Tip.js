import mongoose from 'mongoose';
const { Schema } = mongoose;

const tipSchema = new Schema({
  content: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  subject: { 
    type: Schema.Types.ObjectId, 
    ref: 'Subject', 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Tip = mongoose.model('Tip', tipSchema);
export default Tip;