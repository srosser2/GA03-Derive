import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'

const Home = () => {

  const loggedIn = getLoggedInUserId()

  console.log(loggedIn.userId)

  return <>
  <div className={'heroHome'}>
    <Container>
      <h1>Title</h1>
      <p>Subtitle</p>
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
  </div>
  </>
}

export default Home