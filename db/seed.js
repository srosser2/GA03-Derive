import mongoose from 'mongoose'
import connectToDb from '../lib/connectToDb.js'

import getCountriesData from './data/countryData.js'
import userData from './data/userData.js'
import createManyComments from './data/commentData.js'
import dummyUserData from './data/dummyUserData.js'

import Country from '../models/country.js'
import User from '../models/user.js'
import Comment from '../models/comment.js'
import Language from '../models/language.js'

async function seedDatabase() {

  try {
    await connectToDb()
    console.log('🤖 Database connected!')

    await mongoose.connection.db.dropDatabase()

    const countriesData = await getCountriesData()
    const countries = await Country.create(countriesData)
    console.log(`${countries.length} countries added`)

    const languages = []
    countriesData.map(e => e.languages.map(e => e.name).forEach(e => languages.push(e)))
    const uniqueLangs = [...new Set(languages)].map(e => {
      return { name: e }
    })
    const languagesAdded = await Language.create(uniqueLangs)
    console.log(`${languagesAdded.length} languages added`)

    const combinedUserArray = userData.concat(dummyUserData(60, countries))
    const users = await User.create(combinedUserArray)
    console.log(`${users.length} users added`)
    const commentsToBeCommited = createManyComments(2000, users, countries)
    const comments = await Comment.create(commentsToBeCommited)
    for (let i = 0; i < comments.length; i++) {
      await Country.findByIdAndUpdate({ _id: comments[i].country }, { $push: { comments: comments[i]._id } })
    }
    console.log(`${comments.length} comments added`)

  } catch (err) {
    console.log('SOMETHIN AINT RIGHT')

    console.log(err)
  }

  await mongoose.connection.close()
  console.log('🤖 Goodbye!')
} 

seedDatabase()