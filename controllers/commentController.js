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
  },
  async deleteComment(req, res, next){
    const currentUser = req.currentUser
    const { countryId, commentId } = req.params
    try {
      const comment = await Comment.findById(commentId)
      if (!comment.user.equals(currentUser._id)) {
        return res.status(401).send({ message: 'Unauthorized - cant delete someone elses comment' })
      }
      await Comment.findByIdAndDelete(commentId)
      await Country.findByIdAndUpdate({ _id: countryId }, { $pull: { comments: commentId } } )
      await User.findByIdAndUpdate({ _id: currentUser._id }, { $pull: { comments: commentId } } )
      res.status(200).send({ message: `Comment ${commentId} deleted!` })
    } catch (err) {
      next(err)
    }
  },
  async updateComment(req, res, next){
    const currentUser = req.currentUser
    const commentId = req.params.commentId
    console.log(currentUser, commentId)
    try {
      const comment = await Comment.findById(commentId)
      if (!comment.user.equals(currentUser._id)) {
        return res.status(401).send({ message: 'Unauthorized - cant update someone elses comment' })
      }
      comment.set(req.body)
      await comment.save()
      res.status(200).send({ message: `Comment ${commentId} updated!` })
    } catch (err) {
      next(err)
    }
  }
  
}

export default commentController