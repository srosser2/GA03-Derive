import mongoose from 'mongoose'
import connectToDb from '../lib/connectToDb.js'

import getCountriesData from './data/countryData.js'

import Country from '../models/country.js'

async function seedDatabase() {

  try {
    await connectToDb()
    console.log('🤖 Database connected!')

    await mongoose.connection.db.dropDatabase()

    const countriesData = await getCountriesData()
    const countries = await Country.create(countriesData)
    console.log(`${countries.length} countries added`)

  } catch (err) {
    console.log(err)
  }

  await mongoose.connection.close()
  console.log('🤖 Goodbye!')
} 

seedDatabase()