import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note:  { type: Schema.Types.ObjectId, ref: 'Note', required: true }
});


bookmarkSchema.index({ user: 1, note: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
