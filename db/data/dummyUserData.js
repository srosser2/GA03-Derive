import faker from 'faker'
import randomAvatar from './randomAvatar.js'

export default function generateManyUsers(count, countries) {

  const generatedUsers = []

  const getRandomCountryIds = (count) => {
    const array = []
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * countries.length)
      if (array.indexOf(countries[index]._id) === -1){
        array.push(countries[index]._id)
      }
    }
    return array
  }

  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const dob = faker.date.between(1950, 2001)
    const birthYear2Digits = dob.toLocaleString().slice(7, 9)
    const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}@example.com`

    const user = {
      fullName: `${firstName} ${lastName}`,
      username: `${lastName.toLowerCase()}${birthYear2Digits}`,
      email,
      password: 'password',
      passwordConfirmation: 'password',
      bio: faker.random.words(Math.floor(Math.random() * 150) + 20),
      nationality: '',
      countriesVisited: getRandomCountryIds(Math.floor(Math.random() * 30), countries),
      countriesWishList: getRandomCountryIds(Math.floor(Math.random() * 30), countries),
      isTravelling: faker.random.boolean(),
      isPublic: faker.random.boolean(),
      friends: [],
      sentRequests: [],
      receivedRequests: [],
      languages: [],
      profilePicture: randomAvatar()
    }
    generatedUsers.push(user)
  }
  return generatedUsers
}

