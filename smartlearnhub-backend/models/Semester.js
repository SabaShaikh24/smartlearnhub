import mongoose from 'mongoose';
const { Schema } = mongoose;

const semesterSchema = new Schema({
  name: { type: String, required: true },
  degreeId: {
    type: Schema.Types.ObjectId,           
    required: true
  },
  order: { type: Number, default: 1 }
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
