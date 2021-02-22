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
        { 
          userId: user._id,
          fullName: user.fullName
        },
        secret,
        { expiresIn: '12h' }
      )
      res.status(202).send(({ token, message: 'Login successful' }))
    } catch (err) {
      next(err)
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await User.find()
      res.status(200).send(users)
    } catch (err) {
      next(err)
    }
  },

  async getUserById(req, res, next) {
    const id = req.params.id
    try {
      const user = await User.findById(id).populate('comments').populate('friends').populate('countriesVisited')
      //.populate('comments.user')
      res.status(202).send(user)
    } catch (err) {
      next(err)
    }
  },

  async editUser(req, res, next) {
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
      next(err)
    }
  },

  async sendFriendRequest(req, res, next) {
    const targetFriendId = req.params.id
    const currentUser = req.currentUser._id
    try {
      const targetFriend = await User.findById(targetFriendId)
      const friendSendingRequest = await User.findById(currentUser)
      if (!targetFriend) {
        return res.send({ message: 'This user does not exist' })
      }

      if (targetFriend.friends.indexOf(friendSendingRequest._id) >= 0) {
        return res.send({ message: 'Calm down, they\'re already your friend' })
      }

      if (targetFriend.receivedRequests.indexOf(friendSendingRequest._id) !== -1) {
        return res.send({ message: 'You\'ve already sent a request!' })
      }
      // ! this line is updating the target friend
      await User.findByIdAndUpdate({ _id: targetFriend._id }, { $push: { receivedRequests: friendSendingRequest._id } })
      // ! this is updating the current user 
      await User.findByIdAndUpdate({ _id: friendSendingRequest._id }, { $push: { sentRequests: targetFriend._id } })
      res.send({ message: 'Friend request sent', Id: targetFriend._id })
    } catch (err) {
      next(err)
    }
  },

  async confirmRequest(req, res, next) {
    const targetFriendId = req.params.id
    const currentUser = req.currentUser._id
    try {
      const friendAwaitingRequest = await User.findById(targetFriendId)
      const friendConfirmingRequest = await User.findById(currentUser)
      if (!friendAwaitingRequest) {
        return res.send({ message: 'This user does not exist so you can\'t add them' })
      }

      if (friendAwaitingRequest.friends.indexOf(friendConfirmingRequest._id) >= 0) {
        return res.send({ message: 'Calm down, they\'re already your friend' })
      }

      // ? removing IDs from the pending arrays
      await User.findByIdAndUpdate({ _id: friendAwaitingRequest._id }, { $pull: { sentRequests: friendConfirmingRequest._id } })
      await User.findByIdAndUpdate({ _id: friendConfirmingRequest._id }, { $pull: { receivedRequests: friendAwaitingRequest._id } })
      // ? adding ID of friend sending and friend receiving request to the friends array
      if (req.body.isAccepted) {
        await User.findByIdAndUpdate({ _id: friendAwaitingRequest._id }, { $push: { friends: friendConfirmingRequest._id } })
        await User.findByIdAndUpdate({ _id: friendConfirmingRequest._id }, { $push: { friends: friendAwaitingRequest._id } })
        return res.send({ message: 'They like you - congrats, friend request accepted' })
      }
      res.send({ message: 'Sorry, they don\'t like you' })
    } catch (err) {
      next(err)
    }
  }
}

export default userController