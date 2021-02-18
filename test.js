import User from './models/user.js'

const a = new User({
  password: 'abcdef'
})

console.log(a)
console.log(a.validatePassword('a'))