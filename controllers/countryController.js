import { Error } from 'mongoose'
import Country from '../models/country.js'

const countryController = {
  async getAllCountries(req, res, next) {
    try {
      const countries = await Country.find()
      res.status(200).send(countries)
    } catch (err) {
      next(err)
    }
  },




}

export default countryController