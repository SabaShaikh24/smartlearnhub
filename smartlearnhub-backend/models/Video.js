import mongoose from 'mongoose';
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  description: String
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
