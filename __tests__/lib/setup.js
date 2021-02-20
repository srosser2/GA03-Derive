import User from '../../models/user.js'
import Country from '../../models/country.js'
import userData from '../../db/data/userData.js'
import countryData from '../../db/data/countryData.js'

export default async function setup(done) {

  await User.create(userData)
  await Country.create([
    {
      "images": [],
      "comments": [],
      "latlng": [
        33,
        65
      ],
      "_id": "603030d54ff0a0516d941179",
      "name": "Afghanistan",
      "alpha3Code": "AFG",
      "capital": "Kabul",
      "region": "Asia",
      "population": 27657145,
      "area": 652230,
      "nativeName": "افغانستان",
      "flag": "https://restcountries.eu/data/afg.svg",
      "__v": 0
    },
    {
      "images": [],
      "comments": [],
      "latlng": [
        60.116667,
        19.9
      ],
      "_id": "603030d54ff0a0516d94117a",
      "name": "Åland Islands",
      "alpha3Code": "ALA",
      "capital": "Mariehamn",
      "region": "Europe",
      "population": 28875,
      "area": 1580,
      "nativeName": "Åland",
      "flag": "https://restcountries.eu/data/ala.svg",
      "__v": 0
    },
    {
      "images": [],
      "comments": [],
      "latlng": [
        41,
        20
      ],
      "_id": "603030d54ff0a0516d94117b",
      "name": "Albania",
      "alpha3Code": "ALB",
      "capital": "Tirana",
      "region": "Europe",
      "population": 2886026,
      "area": 28748,
      "nativeName": "Shqipëria",
      "flag": "https://restcountries.eu/data/alb.svg",
      "__v": 0
    }
  ])
  done()
}