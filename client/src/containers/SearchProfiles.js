import React, { useEffect, useState } from 'react'
import Form from '../components/Form.js'
import axios from 'axios'
import { Button, Container, Media } from 'react-bootstrap'
import { getLoggedInUserId } from '../lib/auth.js'
import { Link } from 'react-router-dom'

const SearchProfiles = () => {

  const [allUsers, updateAllUsers] = useState([])
  const [displayUsers, updateDisplayUsers] = useState([])
  const [button, updateButton] = useState(false)
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

  const currentUserId = getLoggedInUserId()
  const token = localStorage.getItem('token')


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

  const addFriend = async (user) => {
    console.log(token)
    await axios.post(`/api/users/${user._id}/add`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) =>
        console.log(data))
    updateButton(true)
  }

  const searchResults = displayUsers.map((user, index) => {

    let friendStatus
    if (!user.friends.includes(currentUserId) || user.sentRequests.includes(currentUserId) || user.receivedRequests.includes(currentUserId)) {
      friendStatus = <Button onClick={() => addFriend(user)}>Add Friend</Button>
    } else if (user.friends.includes(currentUserId)) {
      friendStatus = <p>Friends ✅</p>
    } else if (user.sentRequests.includes(currentUserId) || user.receivedRequests.includes(currentUserId) || button === true) {
      friendStatus = <p>Friend request sent</p>
    }

    return <div key={index}>
      <Media>
        <img width={64} height={64} src="" alt="user image" />
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