import express from 'express'
import router from './views/router.js'
// import logger from './middleware/logger.js'
// import errorHandler from './middleware/errorHandler.js'
import connectDB from './lib/connectToDb.js'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler.js'

const app = express()
dotenv.config()

const startServer = async () => {
  
  await connectDB()
  app.use(express.json())
  app.use('/api', router)
  // app.use(logger)
  app.use(errorHandler)

  app.listen(8000, () => console.log('Server running on port 8000'))
}

startServer()

export default app