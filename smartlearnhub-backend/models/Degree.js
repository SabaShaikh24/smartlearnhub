import mongoose from 'mongoose';
const { Schema } = mongoose;

const degreeSchema = new Schema({
  id: { type: Number, required: true, unique: true },   
  name: { type: String, required: true },               
  short: { type: String, required: true }               
});

const Degree = mongoose.model('Degree', degreeSchema);
export default Degree;
