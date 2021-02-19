import React from 'react'
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'


const NavBar = ({ history }) => {

  // const token = localStorage.getItem('token')
  // const userId = JSON.parse(atob(token.split('.')[1])).userId

  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/home')
  }
  const loggedIn = getLoggedInUserId()

  return <>
    <Navbar>
      <Nav.Link href="/">Logo</Nav.Link>
      <Navbar.Collapse className="justify-content-end">
        {/* <Button href="#home">About</Button> */}
        {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
        {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
        {/* needs testing */}
        {loggedIn && <>
          <Button onClick={handleLogout}>Logout</Button>
          <Nav.Link href="/search-countries">Explore Countries</Nav.Link>
          <Nav.Link href="/user">Profile</Nav.Link>
          <Nav.Link href="">Nofications</Nav.Link>
          <Nav.Link href="/search-profiles">Search for friends</Nav.Link>
          <Navbar.Text>Signed in as: <a href="/user">User Id</a></Navbar.Text>
        </>}
      </Navbar.Collapse>
    </Navbar>
  </>
}

export default NavBar
