import mongoose from 'mongoose'


const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  country: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
}, {
  timestamps: true
})

export default mongoose.model('Comment', commentSchema)

