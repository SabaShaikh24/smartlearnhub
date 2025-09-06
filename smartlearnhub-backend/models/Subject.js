import mongoose from 'mongoose';
const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: { type: String, required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  code: { type: String },
  credits: { type: Number },
  order: { type: Number },
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
