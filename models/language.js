import mongoose from 'mongoose'

const languageSchema = new mongoose.Schema({
  name: { type: String }
})

export default mongoose.model('Language', languageSchema)

