import path from 'path'
const __dirname = path.resolve()
const dist = path.join(__dirname, 'dist')

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
  app.use(express.json({
    limit: 10000000
  }))
  app.use('/api', router)
  // app.use(logger)
  app.use(errorHandler)

  app.use('/', express.static(dist))

  app.get('*', function(req, res) {
    res.sendFile(path.join(dist, 'index.html'))
  })

  app.listen(8000, () => console.log('Server running on port 8000'))
}

startServer()

export default app