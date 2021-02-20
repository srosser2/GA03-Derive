import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Navbar, Nav } from 'react-bootstrap'
import axios from 'axios'

import { getLoggedInUserId } from '../lib/auth.js'

// ! Outstanding to do:
// ! 1. new notfications - define route and what are we displaying?

const NavBar = () => {

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
    const { data } = await axios.get(`/api/users/${userId}`)
    updateUser(data.fullName)
  }


  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/')
  }

  const loggedIn = getLoggedInUserId()

  return <>
    <Navbar>
      <Nav.Link href="/">Logo</Nav.Link>
      <Navbar.Collapse className="justify-content-end">
        {/* <Button href="#home">About</Button> */}
        {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
        {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
        {loggedIn && <>
          <Button onClick={handleLogout}>Logout</Button>
          <Nav.Link href="/search-countries">Explore...</Nav.Link>
          <Nav.Link href="/user">Profile</Nav.Link>
          <Nav.Link href="">New Nofications</Nav.Link>
          <Nav.Link href="/search-profiles">Search for friends</Nav.Link>
          <Navbar.Text>Signed in as: <a href="/user">{user}</a></Navbar.Text>
        </>}
      </Navbar.Collapse>
    </Navbar>
  </>
}

export default withRouter(NavBar)
