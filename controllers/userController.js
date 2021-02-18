import User from '../models/user.js'

const userController = {
  async postUser (req, res, next) {
    console.log(req.body)
    res.send(req.body)
  }
}


export default userController