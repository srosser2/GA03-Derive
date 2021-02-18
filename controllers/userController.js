import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'

const userController = {
  async register(req, res, next) {
    const body = req.body
    try {
      const user = await User.create(body)
      res.status(201).send(user)
    } catch (err) {
      next(err)
    }
  },

  async login(req, res, next) {
    const password = req.body.password
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user || !user.validatePassword(password)) {
        return res.status(401).send({ message: 'Unauthorized' })
      }
      const token = jwt.sign(
        { userId: user._id },
        secret,
        { expiresIn: '12h' }
      )
      res.status(202).send(({ token, message: 'Login successful' }))
    } catch (err) {
      next(err)
    }
  },

  async getUserById(req, res, next){
    const id = req.params.id
    try {
      const user = await User.findById(id).populate('comments')
      //.populate('comments.user')
      res.status(202).send(user)
    } catch (err) {
      next(err)
    }
  },

  async editUser(req, res, next){
    const id = req.params.id
    const currentUser = req.currentUser
    const body = req.body
    try {
      const userToUpdate = await User.findById(id)
      if (!userToUpdate) {
        return res.send({ message: 'No user found' })
      }
      if (!userToUpdate._id.equals(currentUser._id)) {
        return res.status(401).send({ message: 'Unauthorized' })
      }
      userToUpdate.set(body)
      userToUpdate.save()
      res.send(userToUpdate)
    } catch (err) {
      next()
    }
  }
    

}




export default userController