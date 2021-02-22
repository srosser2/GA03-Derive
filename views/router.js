import express from 'express'
import userController from '../controllers/userController.js'
import secureRoute from '../middleware/secureRoute.js'
import countryController from '../controllers/countryController.js'
import commentController from '../controllers/commentController.js'
import languageController from '../controllers/languageController.js'

const router = express.Router()

router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)

router.route('/users')
  .get(userController.getAllUsers)

router.route('/users/:id')
  .get(userController.getUserById)
  .put(secureRoute, userController.editUser)

router.route('/users/:id/add')
  .post(secureRoute, userController.sendFriendRequest)

router.route('/users/:id/acceptFriend')
  .post(secureRoute, userController.confirmRequest)

router.route('/countries')
  .get(countryController.getAllCountries)

router.route('/countries/:id')
  .get(countryController.getCountryById)

router.route('/countries/:id/comments')
  .post(secureRoute, commentController.postComment)

router.route('/countries/:countryId/comments/:commentId')
  .put(secureRoute, commentController.updateComment)
  .delete(secureRoute, commentController.deleteComment)

router.route('/comments')
  .get(commentController.getAllComments)

router.route('/comments/:commentId')
  .post(secureRoute, commentController.toggleLikeComment)

router.route('/languages')
  .get(languageController.getAllLanguages)

export default router

