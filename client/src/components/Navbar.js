import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Navbar, Nav } from 'react-bootstrap'
import axios from 'axios'

import { getLoggedInUserId } from '../lib/auth.js'

// ! Outstanding to do:
// ! 1. new notfications - define route and what are we displaying?

const NavBar = ({ history }) => {

  const [user, updateUser] = useState({})

  const token = localStorage.getItem('token')
  if (token) {
    const userId = JSON.parse(atob(token.split('.')[1])).userId
    if (!userId) {
      return
    }
    fetchData(userId)
  }

  async function fetchData(userId) {
    // const { data } = await axios.get(`/api/users/${userId}`)
    // return updateUser(data)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/')
  }

  const loggedIn = getLoggedInUserId()

  console.log(loggedIn)

  return <>
    <Navbar bg="dark">
      <Nav.Link href="/">Logo</Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {/* <Button href="#home">About</Button> - this can be added in, if we decide to have an about page. Route also needs to be defined*/}
          {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
          {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
          {loggedIn && <>
            <Button onClick={handleLogout}>Logout</Button>
            <Nav.Link href="/search-countries">Explore...</Nav.Link>
            <Nav.Link href="/user">Profile</Nav.Link>
            <Nav.Link href="">New Nofications</Nav.Link>
            <Nav.Link href="/search-profiles">Search for friends</Nav.Link>
            <Navbar.Text>Signed in as: <a href="/user">{loggedIn.fullName}</a></Navbar.Text>
          </>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
}

export default withRouter(NavBar)
