import React, { useEffect, useState } from 'react'
import Form from '../components/Form.js'
import axios from 'axios'
import { Button, Container, Media } from 'react-bootstrap'
import { getLoggedInUserId } from '../lib/auth.js'
import { Link } from 'react-router-dom'

const SearchProfiles = () => {

  const [allUsers, updateAllUsers] = useState([])
  const [displayUsers, updateDisplayUsers] = useState([])
  const [searchText, updateSearchText] = useState({
    title: {
      label: 'Search by name or username: ',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    }
  })

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('/api/users')
      updateAllUsers(data)
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...searchText }
    updatedForm[name].value = value
    updateSearchText(updatedForm)
  }

  const handleSubmit = () => {
    try {
      const nameSearched = searchText.title.value
      const matchingNames = allUsers.filter(user => {
        return user.fullName.toLowerCase().includes(nameSearched.toLowerCase()) || user.username.toLowerCase().includes(nameSearched.toLowerCase())
      })
      updateDisplayUsers(matchingNames)
    } catch (err) {
      console.log(err)
    }
  }

  const currentUserId = getLoggedInUserId()

  const searchResults = displayUsers.map((user, index) => {
    
    let friendStatus
    if (user.friends.includes(currentUserId)) {
      friendStatus = <p>Friends ✅</p>
    } else if (user.sentRequests.includes(currentUserId) || user.receivedRequests.includes(currentUserId)) {
      friendStatus = <p>Friend request sent</p>
    } else {
      friendStatus = <Button>Add Friend</Button>
    }

    return <div key={index}>
      <Media>
        <img width={64} height={64} src={`${user.profilePicture}`} alt="user image" />
        <Media.Body>
          <Link to={`/users/${user._id}`}>
            <h4>{user.fullName}</h4>
          </Link>
          {friendStatus}
        </Media.Body>
      </Media>
    </div>
  })

  return <>
    <Container>
      <h1>Search Profiles</h1>
      <Form config={searchText} onChange={handleChange} onSubmit={handleSubmit} />
      {searchResults}
    </Container>
  </>
}

export default SearchProfiles