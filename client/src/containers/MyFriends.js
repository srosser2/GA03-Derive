import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Col, Container, Media } from 'react-bootstrap'
import { getLoggedInUserId } from '../lib/auth.js'
import { Link } from 'react-router-dom'
import NavBar from '../components/Navbar'

const MyFriends = () => {

  const [friends, updateFriends] = useState([])

  const currentUserToken = getLoggedInUserId()
  const token = localStorage.getItem('token')

  async function fetchData() {
    const { data } = await axios.get('/api/users')
    const myFriends = data.filter(user => {
      return user.friends.includes(currentUserToken.userId)
    })
    updateFriends(myFriends)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteFriend = async (friend) => {
    try {
      await axios.delete(`/api/users/${friend._id}/deleteFriend`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (err) {
      console.log('Line 32', err)
    }
  }

  let myFriends
  if (friends.length === 0) {
    myFriends = <div>
      <p>No results</p>
    </div>
  }

  if (friends.length > 0) {
    myFriends = friends.map((friend, index) => {
      return <Col key={index}>
        <Media>
          <img width={64} height={64} src={friend.profilePicture} alt="user image" />
          <Media.Body>
            <Link to={`/users/${friend._id}`}>
              <h4>{friend.fullName}</h4>
            </Link>
            <Button onClick={() => deleteFriend(friend)}>Delete Friend</Button>
          </Media.Body>
        </Media>
      </Col>
    })
  }

  return <>
    <NavBar />
    <Container>
      <h1>My friends</h1>
      <p>Number of friends: {friends.length}</p>
      {myFriends}
    </Container>
  </>
}

export default MyFriends


