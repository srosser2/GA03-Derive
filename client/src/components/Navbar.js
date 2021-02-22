import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Navbar, Nav, NavDropdown, Modal, Card } from 'react-bootstrap'
import axios from 'axios'

import { getLoggedInUserId } from '../lib/auth.js'

// ! Outstanding to do:
// ! 1. new notfications - define route and what are we displaying?

const NewFriend = ({ data }) => {
  const [isOn, updateIsOn] = useState(true)
  return <>
    {isOn && <>
      {data.fullName}
      <Button onClick={() => updateIsOn(false)}>Accept</Button>
      <Button onClick={() => updateIsOn(false)}>Reject</Button>
    </>}
  </>
}

const Notifications = ({ notificationsOn, handleShow, user }) => {

  // check if there are any friend requests
  function checkFriends(){
    if (user.receivedRequests.length >= 1){
      return <>
      {user.receivedRequests.map((e, i) => {
        return <NewFriend key={i} data={e} />
      })}
      </>
    } else {
      return <div>No new friends</div>
    }
  }
  
  // check if a person has liked your comment

  // check if a person has commented on your

  return <>
    {notificationsOn && <>
      <Card style={{ width: '18rem', position: 'fixed', right: '0' }}>
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          <Card.Text>
            {user.receivedRequests && checkFriends()}
          </Card.Text>
          <Card.Text>
            XYZ liked your comment
          </Card.Text>
          <Card.Text>
            XYZ commented on your profile
          </Card.Text>
          <Card.Link onClick={() => console.log('saved')}>Save changes</Card.Link>
          <Card.Link onClick={handleShow}>Close</Card.Link>
        </Card.Body>
      </Card>
    </>}
  </>
}

const NavBar = ({ history }) => {

  const [user, updateUser] = useState({})
  const [notificationsOn, updateNotificationsOn] = useState(false)

  async function fetchData() {
    const userId = getLoggedInUserId().userId
    const { data } = await axios.get(`/api/users/${userId}`)
    return updateUser(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/')
  }

  const loggedIn = getLoggedInUserId()

  const handleShow = () => updateNotificationsOn(!notificationsOn)

  return <>
    <Navbar bg="dark" expand="lg">
      <Nav.Link href="/">Logo</Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {loggedIn && <>
          {/* <Button class={'btn btn-secondary btn-sm'} onClick={handleLogout}>Logout</Button> */}
          <NavDropdown title={loggedIn.fullName} id="basic-nav-dropdown" className="justify-content-end">
            <NavDropdown.Item href="/user">Profile</NavDropdown.Item>
            <NavDropdown.Item href="">New Nofications</NavDropdown.Item>
            <NavDropdown.Item href="/search-countries">Explore...</NavDropdown.Item>
            <NavDropdown.Item href="/search-profiles">Search for friends</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </>}
        <Nav.Link onClick={() => handleShow()}>Notifications</Nav.Link>
        {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
        {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
        {loggedIn && <img src="https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg" alt="placeholder" style={{ borderRadius: '100%', width: '50px', padding: 5 }} />}
      </Navbar.Collapse>
    </Navbar>

    <Notifications handleShow={handleShow} notificationsOn={notificationsOn} user={user}/>
  </>
}

export default withRouter(NavBar)
