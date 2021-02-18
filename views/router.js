import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

router.route('/users')
  .post(userController.postUser)

export default router