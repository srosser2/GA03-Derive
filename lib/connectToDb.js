import mongoose from 'mongoose'
import { dbURI } from '../config/environment.js'

const connectDB = () => {

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }

  return mongoose.connect(dbURI, options)
}

export default connectDB