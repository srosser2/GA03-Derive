import React, { useEffect, useState } from 'react'
import Form from '../components/Form.js'
import axios from 'axios'
import { Button, Container, Media } from 'react-bootstrap'
import { getLoggedInUserId } from '../lib/auth.js'
import { Link } from 'react-router-dom'
import NavBar from '../components/Navbar'

const SearchProfiles = () => {

  const [allUsers, updateAllUsers] = useState([])
  const [displayUsers, updateDisplayUsers] = useState([])
  const [searchText, updateSearchText] = useState({
    title: {
      input: '',
      placeholder: 'Search by name or username: ',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    }
  })
  const [search, updateSearch] = useState('')

  const currentUserToken = getLoggedInUserId()
  const token = localStorage.getItem('token')

  async function fetchData() {
    const { data } = await axios.get('/api/users')
    const sortArray = data
    sortArray.sort(function (a, b) {
      return b.friends.includes(currentUserToken.userId) ? 1 : -1
    })
    updateAllUsers(sortArray)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...searchText }
    updatedForm[name].value = value
    updateSearchText(updatedForm)
  }

  // LEGACY - REMOVE
  // const handleSubmit = () => {
  //   try {
  //     const nameSearched = searchText.title.value
  //     const removeLoggedInUser = allUsers.filter(user => !user._id.includes(`${currentUserToken.userId}`))
  //     const matchingNames = removeLoggedInUser.filter(user => {
  //       return user.fullName.toLowerCase().includes(nameSearched.toLowerCase()) || user.username.toLowerCase().includes(nameSearched.toLowerCase())
  //     })
  //     updateDisplayUsers(matchingNames)
  //     updateSearch(nameSearched)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const formControls = {
    submit: {
      handler: () => {
        try {
          const nameSearched = searchText.title.value
          const removeLoggedInUser = allUsers.filter(user => !user._id.includes(`${currentUserToken.userId}`))
          const matchingNames = removeLoggedInUser.filter(user => {
            return user.fullName.toLowerCase().startsWith(nameSearched.toLowerCase()) || user.username.toLowerCase().startsWith(nameSearched.toLowerCase())
          })
          updateDisplayUsers(matchingNames)
          updateSearch(nameSearched)
        } catch (err) {
          console.log(err)
        }
      },
      label: 'Search',
      classes: []
    }
  }

  const addFriend = async (user) => {
    try {
      await axios.post(`/api/users/${user._id}/add`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(({ data }) => {
          const updatedDisplayUsers = [...displayUsers]
          const findUser = updatedDisplayUsers.find(user => user._id === data.Id)
          findUser.receivedRequests.push(currentUserToken.userId)
          updateDisplayUsers(updatedDisplayUsers)
        })
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  let searchResults

  if (displayUsers.length > 0) {
    searchResults = displayUsers.map((user, index) => {
      let friendStatus
      if (user.friends.includes(currentUserToken.userId)) {
        friendStatus = <p>Friends ✅</p>
      } else if (user.receivedRequests.includes(currentUserToken.userId) || user.sentRequests.includes(currentUserToken.userId)) {
        friendStatus = <p>Friend request sent</p>
      } else {
        friendStatus = <Button onClick={() => addFriend(user)}>Add Friend</Button>
      }

      return <div key={index}>
        <Media>
          <img width={64} height={64} src={user.profilePicture} alt="user image" />
          <Media.Body>
            <Link to={`/users/${user._id}`}>
              <h4>{user.fullName}</h4>
            </Link>
            {friendStatus}
          </Media.Body>
        </Media>
      </div>
    })
  }

  if (search.length > 0 && displayUsers.length === 0) {
    searchResults = <div>
      <p>No results - please refine your search</p>
    </div>
  }

  return <>
    <NavBar />
    <Container>
      <h1>Search Profiles</h1>
      <Form
        config={searchText}
        onChange={handleChange}
        // onSubmit={handleSubmit}
        controls={formControls}
      />
      {searchResults}
    </Container>
  </>
}

export default SearchProfiles