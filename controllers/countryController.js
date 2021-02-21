
import Country from '../models/country.js'

const countryController = {
  async getAllCountries(req, res, next) {
    try {
      const countries = await Country.find().populate('comments')
      res.status(200).send(countries)
    } catch (err) {
      next(err)
    }
  },
  async getCountryById(req, res, next) {
    const id = req.params.id
    try {
      const country = await Country.findById(id).populate({ path: 'comments', populate: { path: 'user' }})
      res.status(200).send(country)
    } catch (err) {
      next(err)
    }
  }


}

export default countryController