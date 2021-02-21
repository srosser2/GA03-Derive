import mongoose from 'mongoose'
import connectToDb from '../lib/connectToDb.js'

import getCountriesData from './data/countryData.js'
import userData from './data/userData.js'
import createManyComments from './data/commentData.js'

import Country from '../models/country.js'
import User from '../models/user.js'
import Comment from '../models/comment.js'

async function seedDatabase() {

  try {
    await connectToDb()
    console.log('🤖 Database connected!')

    await mongoose.connection.db.dropDatabase()

    const countriesData = await getCountriesData()
    const countries = await Country.create(countriesData)
    console.log(`${countries.length} countries added`)
    const users = await User.create(userData)
    console.log(`${users.length} users added`)
    // const generateComments = createManyComments(1, users, countries)
    const commentsToBeCommited = createManyComments(400, users, countries)
    const comments = await Comment.create(commentsToBeCommited)
    for (let i = 0; i < comments.length; i++) {
      await Country.findByIdAndUpdate({ _id: comments[i].country}, { $push: { comments: comments[i]._id }})
    }
    
    // Country.findByIdAndUpdate({ _id: comments[1].country}, { $push: { comments: comments[1]._id }})
    // Country.findByIdAndUpdate({ _id: comments[2].country}, { $push: { comments: comments[2]._id }})
    // Country.findByIdAndUpdate({ _id: comments[3].country}, { $push: { comments: comments[3]._id }})
    // Country.findByIdAndUpdate({ _id: comments[4].country}, { $push: { comments: comments[4]._id }})
    // comments.forEach(async comment => {
    //   console.log(comment.country)
    //   try {
    //     const country = await Country.findByIdAndUpdate({ _id: comment.country}, { $push: { comments: comment._id }})
    //   } catch (err) {
    //     console.log(err)
    //   }
    // })


  } catch (err) {
    console.log('SOMETHIN AINT RIGHT')

    console.log(err)
  }

  await mongoose.connection.close()
  console.log('🤖 Goodbye!')
} 

seedDatabase()