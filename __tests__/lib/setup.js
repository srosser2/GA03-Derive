import User from '../../models/user.js'
import userData from '../../db/data/userData.js'

export default async function setup (done) {
  await User.create(userData)
  done()
}