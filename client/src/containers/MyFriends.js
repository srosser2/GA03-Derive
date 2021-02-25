import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Card, CardDeck, Col, Container, Media } from 'react-bootstrap'
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
    myFriends = <CardDeck>
      {friends.map((friend, index) => {
        return <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4}>
          <Card className={'country-card'}>
            <div>
              <Card.Img variant="top" width={64} height={64} src={friend.profilePicture} alt="user image" className={'flag'} />
            </div>
            <Card.Body>
              <Card.Title>
                <Link to={`/users/${friend._id}`}>
                  <h4 className={'FriendsCardHeader'}>{friend.fullName.length >= 15
                    ? friend.fullName.slice(0, 15) + '...'
                    : friend.fullName
                  }</h4>
                </Link>
              </Card.Title>
              <div className={'addFriendButtonContainer'}>
                <Button onClick={() => deleteFriend(friend)}>Delete Friend</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      })}
    </CardDeck>
  }

  return <>
    <NavBar />
    <Container>
      <h2 className={'countriesH2'}>My friends</h2>
      <p>Number of friends: {friends.length}</p>
      {myFriends}
    </Container>
  </>
}

export default MyFriends
