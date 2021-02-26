import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import axios from 'axios'

import { getLoggedInUserId } from '../lib/auth.js'

import NotificationDisplay from './NotificationDisplay'

const NavBar = ({ history }) => {

  const loggedIn = getLoggedInUserId()
  const token = localStorage.getItem('token')

  const [user, updateUser] = useState({})
  const [notificationsOn, updateNotificationsOn] = useState(false)

  async function fetchData() {
    const userId = loggedIn.userId
    const { data } = await axios.get(`/api/users/${userId}`)
    return updateUser(data)
  }

  useEffect(() => {
    fetchData()
    setInterval(() => {
      fetchData()
    }, 3000)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    history.push('/')
  }

  const handleShow = () => updateNotificationsOn(!notificationsOn)

  async function postFriendRequest(targetFriendId, action) {
    const body = { 'isAccepted': action }
    const { data } = await axios.post(`/api/users/${targetFriendId}/acceptFriend`, body, { headers: { 'Authorization': `Bearer ${token}` } }).catch(err => console.log(err, data))
    const copy = user
    copy.receivedRequests = copy.receivedRequests.filter(e => e._id !== targetFriendId)
    updateUser(copy)
    updateNotificationsOn(false)
  }

  return <>
    <Navbar expand="lg">
      <Nav.Link href="/" className={'logo'}>Dérive</Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">

        <Nav.Link href="/about">About</Nav.Link>
        {loggedIn && <>
          <NavDropdown title={loggedIn.fullName} id="basic-nav-dropdown" className="justify-content-end">
            <NavDropdown.Item href={`/users/${loggedIn.userId}`}>Profile</NavDropdown.Item>
            <NavDropdown.Item href="/countries">Explore Countries</NavDropdown.Item>
            <NavDropdown.Item href="/search-profiles">Search for friends</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Notifications" id="basic-nav-dropdown" className="justify-content-end">
            <Container>Notifications</Container>
            <NavDropdown.Divider />
            {user.receivedRequests && <NotificationDisplay postFriendRequest={postFriendRequest} handleShow={handleShow} notificationsOn={notificationsOn} user={user} />}
          </NavDropdown>
        </>}

        {!loggedIn && <Nav.Link href="/register">Register</Nav.Link>}
        {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
        {loggedIn && <a href={`/users/${loggedIn.userId}`} ><img src={user.profilePicture
          ? user.profilePicture
          : 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} alt="placeholder" style={{ borderRadius: '100%', width: '50px', padding: 5 }} /></a>}

      </Navbar.Collapse>
    </Navbar>
    {user.receivedRequests && <>{user.receivedRequests.length > 0 && <img src="http://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Transparent-Picture.png" width="30px" style={{
      position: 'fixed',
      left: '92%',
      top: '50px',
      float: 'right'
    }} />}</>}
  </>
}

export default withRouter(NavBar)
