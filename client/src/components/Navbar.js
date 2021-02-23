import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import axios from 'axios'

import { getLoggedInUserId } from '../lib/auth.js'

import Notifications from '../components/Notifications'

// ! Outstanding to do:
// ! 1. new notfications - define route and what are we displaying?

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
    setInterval(() => {
      fetchData()
      console.log('checking for notifications')
    },10000)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/')
  }

  const loggedIn = getLoggedInUserId()

  const handleShow = () => updateNotificationsOn(!notificationsOn)

  async function postFriendRequest(targetFriendId, action) {
    const body = { "isAccepted": action }
    const token = localStorage.getItem('token')
    const { data } = await axios.post(`/api/users/${targetFriendId}/acceptFriend`, body, { headers: { "Authorization" : `Bearer ${token}` } }).catch(err => console.log(err))
    console.log(data, "friend request dealt with")
    // remove the friend from the friendsRequests state
    const copy = user
    copy.receivedRequests = copy.receivedRequests.filter(e => e._id !== targetFriendId)
    updateUser(copy)
    console.log(user, "this is what will be updated in state")
  }

  return <>
    <Navbar bg="dark" expand="lg">
      <Nav.Link href="/">Logo</Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {loggedIn && <>
          <Button className={'btn btn-secondary btn-sm'} onClick={handleLogout}>Logout</Button>
          <NavDropdown title={loggedIn.fullName} id="basic-nav-dropdown" className="justify-content-end">
            <NavDropdown.Item href={`/users/${loggedIn.userId}`}>Profile</NavDropdown.Item>
            <NavDropdown.Item href="">New Nofications</NavDropdown.Item>
            <NavDropdown.Item href="/countries">Explore...</NavDropdown.Item>
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
    {user.receivedRequests && <>{user.receivedRequests.length > 0 && <img src="http://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Transparent-Picture.png" width="30px" style={{
      position: "fixed",
      left: "92%",
      top: "50px",
      float: "right"
    }}/>}</>}

    {user.receivedRequests && <Notifications postFriendRequest={postFriendRequest} handleShow={handleShow} notificationsOn={notificationsOn} user={user}/>}
  </>
}

export default withRouter(NavBar)
