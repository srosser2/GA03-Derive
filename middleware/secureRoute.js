import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import { secret } from '../config/environment.js'

// ! Make sure the user who is making this request, has a valid token
// ! and they exist. Do they have permission to do this?
export default async function secureRoute(req, res, next) {
  try {
    const authToken = req.headers.authorization

    if (!authToken || !authToken.startsWith('Bearer')) {
      return res.status(401).send({ message: 'Unauthorized - no bearer token' })
    }

    const token = authToken.replace('Bearer ', '')

    console.log('🤖' + ' ' + authToken)
    console.log('🤖' + ' ' + token)

    jwt.verify(token, secret, async (err, data) => {

      if (err) {
        return res.status(401).send({ message: 'Unauthorized - general error' })
      }
      const user = await User.findById(data.userId)

      if (!user) {
        return res.status(401).send({ message: 'Unauthorized - no user found' })
      }

      req.currentUser = user

      next()
    })
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized - were screwed' })
  }
}