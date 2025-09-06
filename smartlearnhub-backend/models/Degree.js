import mongoose from 'mongoose';
const { Schema } = mongoose;

const degreeSchema = new Schema({
  id: { type: Number, required: true, unique: true },   // e.g., 1, 2
  name: { type: String, required: true },               // e.g., "B.Sc. Computer Science"
  short: { type: String, required: true }               // e.g., "BSc CS"
});

const Degree = mongoose.model('Degree', degreeSchema);
export default Degree;
