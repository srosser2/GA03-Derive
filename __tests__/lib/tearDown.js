import User from '../../models/user.js'
import Country from '../../models/country.js'
import Comment from '../../models/comment.js'

export default async function tearDown (done) {
  await User.deleteMany()
  await Country.deleteMany()
  await Comment.deleteMany()
  done()
}