import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'

const Home = () => {

  const loggedIn = getLoggedInUserId()

  return <>
    <Container className="home-container">
      <h1>DÉRIVE</h1>
      <p>Connect, Explore, Travel</p>
      <div>
        {!loggedIn && <>
          <Link
            to={{
              pathname: '/register'
            }}>
            <Button variant="primary">Register</Button></Link>
          <Link
            to={{
              pathname: '/login'
            }}><Button variant="warning">Login</Button></Link>
        </>}
        {loggedIn && <Link
          to={{
            pathname: `/users/${loggedIn.userId}`
          }}><Button variant="warning">Profile</Button></Link>}
      </div>
    </Container>
  </>
}

export default Home