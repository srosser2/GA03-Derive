import express from 'express'
import userController from '../controllers/userController.js'
import secureRoute from '../middleware/secureRoute.js'

const router = express.Router()

router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)

router.route('/user/:id')
  .get(userController.getUserById)
  .put(secureRoute, userController.editUser)


export default router