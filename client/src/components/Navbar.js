import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Navbar, Nav } from 'react-bootstrap'
// import axios from 'axios'

// NavItem, NavDropdown, MenuItem
import { getLoggedInUserId } from '../lib/auth.js'

// ! Outstanding to do:
// ! 1. new notfications - route and what are we displaying?
// ! 2. Need to update username on navbar text to actual username - Stefan to investigate using useContext 

const NavBar = ({ history }) => {

  // const [user, updateUser] = useState({})

  // const token = localStorage.getItem('token')
  // let userId
  // if (token) {
  //   userId = JSON.parse(atob(token.split('.')[1])).userId
  // }

  // if (!userId) {
  //   return
  // }

  // axios.get(`/api/users/${userId}`)
  //   .then(({ data }) => {
  //     console.log(data)
  //     updateUser(data)
  //   })

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
          <Navbar.Text>Signed in as: <a href="/user">Username</a></Navbar.Text>
        </>}
      </Navbar.Collapse>
    </Navbar>
  </>
}

export default withRouter(NavBar)
