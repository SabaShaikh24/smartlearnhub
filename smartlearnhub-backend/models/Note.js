import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },     // link to user
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true }, // link to subject
  createdAt: { type: Date, default: Date.now },
  source: { type: String, enum: ["Wikipedia", "SWAYAM", "OpenLibrary", "Manual"], default: "Manual" },

  filePath: { type: String }, 
  originalFileName: { type: String }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
