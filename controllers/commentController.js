import Comment from '../models/comment.js'
import User from '../models/user.js'
import Country from '../models/country.js'

const commentController = {
  async postComment(req, res, next) {
    const body = req.body
    try {
      const userId = req.currentUser._id
      const user = await User.findById(userId)
      const country = await Country.findById(req.params.id)
      body.user = user._id
      body.country = country._id
      const comment = await Comment.create(body)
      await Country.findByIdAndUpdate({ _id: country._id }, { $push: { comments: comment._id } })
      await User.findByIdAndUpdate({ _id: user._id }, { $push: { comments: comment._id } })
      res.send(comment)
    } catch (err) {
      next(err)
    }
  }
}

export default commentController