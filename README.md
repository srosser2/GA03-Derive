### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

# Dérive - Project 3

## Overview

Dérive brings together like-minded individuals who have a passion for travelling and provides a space to explore countries, connect with others and share experiences.

by [Hannah Akhtar](https://github.com/hannahakhtar), [Sam Rosser](https://github.com/srosser2) and [Stefan Sokolowski](https://github.com/Steftones).

## Project Brief

* Work in a team, using **git to code collaboratively**.
* **Build a full-stack application** by making your own backend and your own frontend
* **Use an Express API** to serve your data from a Mongo database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models
* **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut
* **Have a visually impressive design**
* **Be deployed online** so it's publicly accessible.
* **Have automated tests**

## Technologies used

Backend

- Node.js
- Express
- Mongoose
- MongoDB

Frontend

- HTML5
- SASS
- JavaScript
- Bulma
- React
- React Router
- Webpack

Testing

- Mocha
- Chai
- Supertest

External Libraries

- Axios
- Mapbox
- bcrypt
- React Hook Form

Development tools

- VSCode
- npm
- Insomnia
- Git
- Github
- Google Chrome dev tools
- Heroku (deployment)
- Trello Board (planning and timeline)
- InVision (wireframing)
- Zoom
- Slack

## Approach

### Planning

Once we had decided on our travel app, as a group we built a wireframe using InVision and created the user journey between pages. Given we had a week to complete the project, we used a Trello board and the MoSCow method to determine which features would be included in our MVP, and which features would be included should we be ahead of schedule.

Once the MoSCow was complete, we used Kanban methodology to create tickets based on the user journey and then the backend requirements to facilitate these.

InVision
![InVision image](/assets/InVision.png)

</br>

Trello - MoSCoW
![MoSCoW image](/assets/MoSCoW.png)

</br>

Trello - Kanban
![Kanban image](/assets/Kanban.png)

</br>

<!-- ### Backend

As a team, we decided to pair(/triple) programme for the backend elements of the project so that we all could gain experience, and also to reduce the amount of time spent on the backend due to the navigators spotting any potential bugs.

#### Models

For the models, there were five in total: comment, country, image, language and user.
.populate() here

#### Views

which controllers for which route

#### Controllers

GET, POST, PUT, DELETE for all models

use post comment as an example

#### Middleware

SecureRoute and Error Handler -->

### Frontend

For the frontend, in our daily stand up, we would align tickets to be completed each day. For this project, I took ownership of the home page, nav bar, registration, explore countries, search friends and my friends pages.

#### Registration

At the start of the project, a form component was created as a form was going to be required on a number of the pages across the app. The form component was created using the react hook form and react select libraries.

Due to the creation of this reusable component, it meant that the creation of forms was somewhat automated.

For the registraion page, initially the state of the fields were set to empty strings by setting the state of the form:

```js
const [registerForm, updateRegisterForm] = useState({
    fullName: {
      label: 'Full Name',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your full name',
      value: '',
      validation: {
        required: true
      },
      dirty: false
    },
    email: {
      label: 'Email',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your email',
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      dirty: false
    },
    password: {
      label: 'Password',
      element: 'input',
      type: 'password',
      placeholder: 'Enter your password',
      value: '',
      validation: {
        required: true
      },
      dirty: false
    },
    passwordConfirmation: {
      label: 'Password Confirmation',
      element: 'input',
      type: 'password',
      placeholder: 'Please retype your password',
      value: '',
      validation: {
        required: true
      },
      dirty: false
    },
    bio: {
      label: 'Bio',
      element: 'input',
      type: 'text',
      placeholder: 'Tell us a bit about yourself',
      value: '',
      validation: {
      }
    },
    nationality: {
      label: 'Nationality',
      element: 'input',
      type: 'text',
      placeholder: 'Your nationality',
      value: '',
      validation: {

      }
    },
    languages: {
      label: 'Languages spoken',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [],
      validation: {
      }
    },
    isPublic: {
      label: 'Profile visibility',
      element: 'select',
      value: 'false',
      options: [
        {
          label: 'Public',
          value: true
        },
        {
          label: 'Private',
          value: false
        }
      ],
      validation: {
      }
    },
    isTravelling: {
      label: 'Currently travelling?',
      element: 'select',
      value: 'false',
      options: [
        {
          label: 'Yes',
          value: true
        },
        {
          label: 'No',
          value: false
        }
      ],
      validation: {
      }
    },
    countriesVisited: {
      label: 'Countries you\'ve visited',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [

      ],
      validation: {
      }
    },
    countriesWishList: {
      label: 'Which countries would you like to visit?',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [],
      validation: {
      }
    }
```

</br>

On the initial registration page, all fields here (full name, email address, password and password confirmation) were required fields. There is validation here, should the user input incorrect details e.g. if password was less than 6 characters.

Once the user clicks continue (and fixes any validation errors as required), a modal will appear with a second form, which is used to populate that user's profile. These details are not required to register a profile.

There was a slight difference in the onChange/onSelectChange requirements, depending on whether the form field used react select or not, as indicated in the code snippet below:

```js
  const handleModalChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...registerForm }
    updatedForm[name].value = value
    updateRegisterForm(updatedForm)
  }

  const handleModalSelectChange = (e, name) => {
    const updatedForm = { ...registerForm }
    updatedForm[name].value = e
    updateRegisterForm(updatedForm)
  }
```

</br>

When the user clicks 'sign me up', a post request is sent and the user is added to the database, along with any addtional profile data they have submitted.

#### Explore countries

When a user visits the page, all countries are displayed as cards and users can click to view more information or view the corresponding Wikipedia page. This was achieved using an external API ([Rest Countries API](https://restcountries.eu/)) and filtering the required information for display.

From here, the user can use the search bar, which was created using the reusable form component.

The user can also filter the flag by region, which are defined in an array and mapped over to create the dropdown.

Finally, the user can also click the buttons 'my wish list' and 'countries visited' to filter by countries that the user has indicated on registration or by editing their profile, that they have visited or want to visit.

Below is an example of how the data is filtered for the wish list and this is almost identical for the countries visited button.

```js
const filterCountriesWishList = async () => {
  try {
    const countriesToVisit = userData.countriesWishList
    const countriesWL = countriesToVisit.map(country => {
      return country._id
    })
    const filteredCountries = await countries.filter(country => {
      return countriesWL.includes(country._id)
    })
    updateDisplayCountries(filteredCountries)
  } catch (err) {
    console.log(err)
  }
}
```
</br>

If there were no search results, a message would be displayed to ask the user to search again.

</br>

#### Search Profiles:

</br>

The search profiles/friends page intially shows a search bar, which uses the form component. When the user types in the search bar, this updates the state of searchText. 

For the form controls, the matchingNames variable filtered any users which contained the search result, from the allUsers state (which was determined by a get request on page render).

The search results and the user name were both converted to lower case so that there would be no results missed due to capitalisation differences. State of displayUsers is updated, and all results are then displayed on the page.

```js
  const formControls = {
    submit: {
      handler: () => {
        try {
          const nameSearched = searchText.title.value
          const removeLoggedInUser = allUsers.filter(user => !user._id.includes(`${currentUserToken.userId}`))
          const matchingNames = removeLoggedInUser.filter(user => {
            return user.fullName.toLowerCase().startsWith(nameSearched.toLowerCase())
          })
          updateDisplayUsers(matchingNames)
          updateSearch(nameSearched)
        } catch (err) {
          console.log(err)
        }
      },
      label: 'Search',
      classes: ['searchButton']
    }
  }
```
</br>

The below function was used in the useEffect upon page render. The important aspect here was the returning of friends. I made sure that this was alphabetised, otherwise the list of friends would be displayed in a somewhat random order.

```js
async function fetchData() {
  const { data } = await axios.get('/api/users')
  const sortArray = data
  sortArray.sort(function (a, b) {
    return b.friends.includes(currentUserToken.userId) ? 1 : -1
  })
  updateAllUsers(sortArray)
}
```  
</br>

On each card, I decided to show whether the logged in user was already friends with each returned result, whether a friend request had already been sent and was pending. If neither of these were true, a button would be visible to send a friend request.

Initially, the if statement was in reverse order but it became apparent that this had to be reversed to provide the correct response.

```js
let friendStatus
if (user.friends.includes(currentUserToken.userId)) {
  friendStatus = <p className={'cardText'}>Friends ✅</p>
} else if (user.receivedRequests.includes(currentUserToken.userId) || user.sentRequests.includes(currentUserToken.userId)) {
  friendStatus = <p className={'cardText'}>Friend request sent</p>
} else {
  friendStatus = <div className={'addFriendButtonContainer'}>
    <Button onClick={() => addFriend(user)}>Add Friend</Button>
  </div>
}
```
</br>

If there were no search results, a message would be displayed to ask the user to search again.

</br>

#### My friends

For the my friends page, the fetchData function below was called in the useEffect on page render. In the function, the data from the get request for all users was filtered to return only those that had the logged in user's ID, in their friend's array (which was stored in the backend).

The state for friends was then updated.

```js
async function fetchData() {
  const { data } = await axios.get('/api/users')
  const myFriends = data.filter(user => {
    return user.friends.includes(currentUserToken.userId)
  })
  updateFriends(myFriends)
}
```
</br>

Each of the friends were displayed as cards on the page. Each card was a link that would route you to the profile of that user, and there was also a button to delete a friend.

When this button is clicked, the delete request is fulfilled as per the below. The fetchData function above is also called again, and state updated, so that this deleted friend's profile is immediately removed from display.

```js
const deleteFriend = async (friend) => {
  try {
    await axios.delete(`/api/users/${friend._id}/deleteFriend`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  } catch (err) {
    console.log(err)
  }
}
```
</br>

## Conclusion

### Lessons Learnt

### Wins

- Planning was a big success; using Agile methodologies were extremely useful and agreeing on an MVP early in the process meant that we were able to focus on the core requirements initially and then add in extra features once complete.
- This was my first full-stack project, so it was great to work on the full lifecycle of a project and see the final result.
- The team work was great and through effective communication and willingness to support each other, made the project a great success.

### Challenges

- Using Bootstrap for the first time - some elements need to be re-styled e.g. register and login on mobile devices and profile page (flags and friends) on all devices.

### Future development plans

- Automated unit testing & front end testing
- Pagination for all countries
- For comments, change state of button between like and dislike, dependent on user action.
- Change password function
- Delete Account function

## The Result

Home

![Home image](/assets/Home.png)

</br>

Register

![Register image](/assets/Register.png)

</br>

Login

![Login image](/assets/Login.png)

</br>

Profile

![Profile image](/assets/Profile.png)

</br>

Edit Profile

![Edit profile image](/assets/Edit-profile.png)

</br>

My Friends

![My friends image](/assets/Friends.png)

</br>

Explore Countries

![Explore image](/assets/Explore.png)

</br>

Search for friends

![Search friends image](/assets/Search.png)

