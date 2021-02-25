import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Table, Jumbotron, Card } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'

const Home = () => {

  const loggedIn = getLoggedInUserId()

  return <>
    <Container className="center-me">
      <div className="home-middle">
        <h1 className="justify-center">DÉRIVE</h1>
        <p className="justify-center">Connect, Explore, Travel</p>
        {!loggedIn && <>
          <Table borderless={true}>
            <tr>
              <td><Link to={{ pathname: '/register' }}><Button variant="primary">Register</Button></Link></td>
              <td></td>
              <td><Link to={{ pathname: '/login' }}><Button variant="warning">Login</Button></Link></td>
            </tr>
          </Table>
        </>}
        {loggedIn && <Link className="justify-center" to={{ pathname: `/users/${loggedIn.userId}` }}><Button variant="warning">Profile</Button></Link>}
      </div>
    </Container>
  </>
}

export default Home