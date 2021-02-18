import mongoose from 'mongoose'

const countrySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  nativeName: { type: String },
  alpha3Code: {  type: String, unique: true },
  flag: {  type: String },
  population: { type: Number },
  region: { type: String },
  capital: { type: String },
  images: { type: [String] },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  area: { type: Number },
  latlng: { type: [Number] }
})

export default mongoose.model('Country', countrySchema)