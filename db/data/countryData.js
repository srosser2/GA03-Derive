import axios from 'axios'

export default async function getCountriesData() {

  const data = await axios.get('https://restcountries.eu/rest/v2/all')
    .then(({ data }) => {
      return data
    })
  return data
}