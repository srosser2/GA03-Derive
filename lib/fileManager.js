import dotenv from 'dotenv'
import cloudinary from 'cloudinary'
import path from 'path'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const fileManager = {
  uploadImage: async (localFilePath, options = {}) => {
    try {
      const file = await cloudinary.v2.uploader.upload(localFilePath, options, (err, result) => {
        if (err) {
          console.log(err)
          return err
        }
        console.log(result)
        return result
      })
      return file
    } catch (err) {
      console.log(err)
    }
  },
  deleteImage: async (imageId) => {
    try {
      const deletedFile = await cloudinary.v2.uploader.destroy(imageId, (result) => {
        console.log(result)
        return result
      })
    } catch (err) {
      console.log(err)
    }
    
  }
}
  
export default fileManager