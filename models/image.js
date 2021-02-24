import mongoose from 'mongoose'

const imageSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User', 
    required: true
  },
  tags: {
    type: [String]
  }
},{
  timestamps: true
})

export default mongoose.model('Image', imageSchema)