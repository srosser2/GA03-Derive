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
      console.log(user)
      if (!user || !user.validatePassword(password)) {
        return res.status(401).send({ message: 'Unauthorized' })
      }
      const token = jwt.sign(
        { userUd: user._id },
        secret,
        { expiresIn: '12h' }
      )
      console.log(token)
      res.status(202).send(({ token, message: 'Login successful' }))

    } catch (err) {
      next(err)
    }
  }

}




export default userController