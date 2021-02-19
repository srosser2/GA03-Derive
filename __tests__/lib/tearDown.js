import User from '../../models/user.js'

export default async function tearDown (done) {
  await User.deleteMany()
  done()
}