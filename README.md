### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly - Software Engineering Immersive

# GA Project 3 - Dérive


## Overview

Dérive is a full-stack MERN app that I worked on with 2 other students during the General Assembly Software Engineering Bootcamp. The app is targeted at travellers who want to connect with other travellers and share experiences. 

You can access the site [here](https://derivetravel.herokuapp.com/).

![](https://imgur.com/RbNWpDe.jpg)

## Brief  

* Work in a team, using **git to code collaboratively**
* **Build a full-stack application** by making your own backend and your own front end
* **Use an Express API** to serve your data from a Mongo database
* **Consume your API with a separate front end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models
* **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut
* **Have a visually impressive design** to kick your portfolio up a notch and have something to wow future clients & employers. **ALLOW** time for this.
* **Be deployed online** so it's publicly accessible.
* **Have automated tests** for _at least_ one RESTful resource on the back-end. Improve your employability by demonstrating a good understanding of testing principles.


## Necessary Deliverables  


* A **working app** hosted on the internet
* A **link to your hosted working app** in the URL section of your GitHub repo
* A **Git repository hosted on GitHub**, with a link to your hosted project, and frequent commits dating back to the _very beginning_ of the project
* **A `readme.md` file** with:
    * An embedded screenshot of the app
    * Explanations of the **technologies** used
    * A couple of paragraphs about the **general approach you took**
    * **Installation instructions** for any dependencies
    * Link to your **user stories/wireframes** – sketches of major views / interfaces in your application
    * Link to your **pitch deck/presentation** – documentation of your wireframes, user stories, and proposed architecture
    * Descriptions of any **unsolved problems** or **major hurdles** you had to overcome



## Technologies Used

- **Frontend:** HTML, CSS, Bootstrap, SASS, Javascript, React Hooks, Axios, Mapbox, React Hook Form
- **Backend:** Node.js, MongoDB, Mongoose, Express, Cloudinary
- **Tools:** Git, GitHub, Heroku, Trello, InVision


## Approach

### Planning

I took a lead on the project management given my previous experience, and introduced a number of tools to help manage the project. We used **Trello** as a Kanban board, and **InVision** to prototype and whiteboard out problems. My team mates came up with the concept of a social network for travellers, so we listed all the functionality as user stories and then prioritized them using the **MoSCoW** prioritisation technique. We discussed features and created wireframes, and once we were clear on the project requirements we started building. 


**Trello Kanban**

![](https://imgur.com/vVj2bvA.jpg)


### Back end Development


The app uses a Model View Controller (MVC) architecture, so during the planning phase we decided what fields each model should have to accommodate each feature. We used Express to serve JSON through various API endpoints.

We worked on the back end collaboratively, taking it in turns to 'drive', where the driver would create relevent models based on the wireframes, and link this into the app by building the controller and registering it in the router. We frequently pulled the latest changes from GitHub and tested the API endpoints using Insomnia API client.

####Friend Requests

One of the complicated functionalities in the back end was handling the sending and confirmation of friend requests. We worked out the various states of a friend request using the whiteboard, and then added new properties to the model, and added relevant methods in the controller to manage friends.

**Whiteboard**

![](https://imgur.com/xWrRbp1.jpg)


**controllers/userController.js**

```js
// ...

  async sendFriendRequest(req, res, next) {
    const targetFriendId = req.params.id
    const currentUser = req.currentUser._id
    try {
      const targetFriend = await User.findById(targetFriendId)
      const friendSendingRequest = await User.findById(currentUser)
      if (!targetFriend) {
        return res.send({ message: 'This user does not exist' })
      }

      if (targetFriend.friends.indexOf(friendSendingRequest._id) >= 0) {
        return res.send({ message: 'Calm down, they\'re already your friend' })
      }

      if (targetFriend.receivedRequests.indexOf(friendSendingRequest._id) !== -1) {
        return res.send({ message: 'You\'ve already sent a request!' })
      }
      // ! this line is updating the target friend
      await User.findByIdAndUpdate({ _id: targetFriend._id }, { $push: { receivedRequests: friendSendingRequest._id } })
      // ! this is updating the current user 
      await User.findByIdAndUpdate({ _id: friendSendingRequest._id }, { $push: { sentRequests: targetFriend._id } })
      res.send({ message: 'Friend request sent', Id: targetFriend._id })
    } catch (err) {
      next(err)
    }
  },

  async confirmRequest(req, res, next) {
    const targetFriendId = req.params.id
    const currentUser = req.currentUser._id
    try {
      const friendAwaitingRequest = await User.findById(targetFriendId)
      const friendConfirmingRequest = await User.findById(currentUser)
      if (!friendAwaitingRequest) {
        return res.send({ message: 'This user does not exist so you can\'t add them' })
      }

      if (friendAwaitingRequest.friends.indexOf(friendConfirmingRequest._id) >= 0) {
        return res.send({ message: 'Calm down, they\'re already your friend' })
      }

      // ? removing IDs from the pending arrays
      await User.findByIdAndUpdate({ _id: friendAwaitingRequest._id }, { $pull: { sentRequests: friendConfirmingRequest._id } })
      await User.findByIdAndUpdate({ _id: friendConfirmingRequest._id }, { $pull: { receivedRequests: friendAwaitingRequest._id } })
      // ? adding ID of friend sending and friend receiving request to the friends array
      if (req.body.isAccepted) {
        await User.findByIdAndUpdate({ _id: friendAwaitingRequest._id }, { $push: { friends: friendConfirmingRequest._id } })
        await User.findByIdAndUpdate({ _id: friendConfirmingRequest._id }, { $push: { friends: friendAwaitingRequest._id } })
        return res.send({ message: 'They like you - congrats, friend request accepted' })
      }
      res.send({ message: 'Sorry, they don\'t like you' })
    } catch (err) {
      next(err)
    }
  },
  
// ...

```

####Seed User Data

We initially started out with a handful of users to test with in our seeding data. However, as the app is a Social Network we required a large pool of users to make it interesting, so I decided to improve the seeding data by making a script to create random users. 

I found a popular [avatar generator](https://getavataaars.com/) online that can use a query string to produce random characters, and then I got a list of all the possible options for each parameter by creating some scripts in the dev tools to get options from the select inputs. I then created a script to [generate a random avatar](https://github.com/srosser2/GA03-Derive/blob/main/db/data/randomAvatar.js).

I created a [script](https://github.com/srosser2/GA03-Derive/blob/main/db/data/dummyUserData.js) with a function to create a given number of users, using Faker to populate various fields. This function is used in the `seed.js` file to create a number of random characters.


###Front End Development

Once we had built most of the back end, we split out the front end tasks between us in stages, realigning priorities regularly in standups. 

####The Form Component

One of my main contributions to the project was to build a reusable form component. I used React Hook Forms to create the `<Form ../>`, which took a configuration object to set up various fields required for a given form. The configuration object was made up of child objects, which contained information about how to set up the form, for example: 

**client/src/containers/Login.js**

```js
//...
  const [loginForm, updateLoginForm] = useState({
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
        required: true,
        minLength: 6
      },
      dirty: false
    }
  })
  
 //...

```


The form component can handle inputs, textareas, selects (using React Select) and file uploads.

The form takes a `controls` object for handling the form actions. You pass an object of objects for each button you want to include in the form, and then assign it a handler function to run on click. The made it easy to include submit buttons for making POST/PUT requests, as well as buttons for cancelling.

**client/src/containers/Login.js**

```js
const formControls = {
    submit: {
      label: 'Sign In',
      handler: async () => {
        try {
          const formData = {}
          for (const field in loginForm) {
            formData[field] = loginForm[field].value
            loginForm[field].dirty = true
          }
          const { data } = await axios.post('/api/login', formData).catch(err => console.log(err))
          console.log(data)
          localStorage.setItem('token', data.token)
          history.push(`/users/${getLoggedInUserId().userId}`)
        } catch (err) {
          console.log(err)
          notify.show('Error: please fill in all the required fields', 'error', 2500)
        }
      },
      classes: [
        'btn',
        'btn-primary'
      ]
    },
    cancel: {
      label: 'Cancel',
      handler: () => {
        history.push('/')
      },
      classes: [
        'btn',
        'btn-secondary'
      ]
    }
  }

```

It also takes `handleChange` and `handleSelectChange` functions to ensure 2-way binding with state.

To render the form, the following setup is required:

**client/src/containers/Login.js**

```js
//...
<Form
      config={loginForm}
      controls={formControls}
      onChange={e => handleChange(e)}
      onSelectChange={handleSelectChange} />
//...
```


This component allowed us to create large forms quickly, and manage forms across the app in a unified way. For example, setting up field validation was easy as it could be managed on a global level rather than in specific forms.

The full form component code can be found [here](https://github.com/srosser2/GA03-Derive/blob/main/client/src/components/Form.js).


####File Uploads

Prior to the project, I had no experience in uploading files. Cloudinary had been recommended as an easy way to integrate file storage for images uploads, so I signed up for an account and tested it out. 

First, I set up the backend routes. The backend set up was relatively straight forward, and within a short amount of time I was able to upload images using Insomnia. This took the absolute path of a file on my computer, then passed it to Cloudinary to upload, and then saved the Cloudinary response as a record in MongoDB, keeping the file url and ID from cloudinary, but adding the user information from the initial request (saved in the token).

The second, more complicated step was to accept file uploads from the frontend. Cloudinary provides a widget to handle uploads, but I wanted to customize the UX of this functionality, so I opted to use a `FileReader` instead. One of the challenges I encountered was that the FileReader does not provide an absolute path to the selected file for security reasons, so I had to work around this. 

After some research, I found that I could use the `FileReader` to convert the file to Base64, and then post this to the server. I faced a small issue in that the Express Server had a size limit for accepting JSON requests, so to fix it, I had to specify a `limit` option:

**index.js**

```js
//...
 app.use(express.json({
    limit: 10000000
  }))
//...
```
Once the above was fixed, the upload process worked as expected. I added some basic UI state to indicate to the user that the file was uploading, but this would be improved if it was added as a spinner.

With file uploads implemented, I amended the profile page by adding a gallery of uploaded images, and the functionality to set a profile picture.


###Testing

I added a few integration tests using Chai and Mocha tests early on (such as checking register and login) which made it easy to check the basic functionality still worked when pulling new updates. 

It would have been great to add more testing, however due to the limited time to deliver the project, we focussed on implementing features rather than testing fully.


##Known Bugs

* There is no clear indication of when a user's token has expired, which can be confusing when trying to perform secure actions, such as uploading images. 

##Wins

* I felt the team worked together well on this project. It was our first time using git collaboratively, and we didn't run into many major issues.
* This was the first time I had worked with File Uploads, and now feel confident in working with files and using cloud providers to store the data. I used my knowledge to help other students in the final project.

##Challenges

* We tried to implement a web scraper to get country information from Wikipedia, but there wasn't enough time to properly implement this feature. 

##Future Improvements

* Adding new models for:
	* Posts - users can post statuses with text and images
	* Locations - users can upload locations such as restaurants, hotels etc
	* Messaging - users can send each other private messages
* UX/UI improvements:
	* More context around the app's purpose, features, and navigating through the app
	* Loading spinners
	* Improved validation
	* Make it clear if the users token has expired

##Key Learnings

* Using git merge and branches
* Deploying applications with a MongoDB database
* Working with the file reader and uploading images
