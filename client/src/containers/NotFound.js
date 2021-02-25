import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import Notifications, { notify } from 'react-notify-toast'

import NavBar from '../components/Navbar'

const NotFound = () => {

  const history = useHistory()

  useEffect(() => {
    notify.show('Error: page not found', 'error', 2500)
  },[])

  return <>
    <Notifications />
    <NavBar />
    <Container>
      <h1>Oops!</h1>
      <p>Your page was not found...</p>
      <br />
      <Button onClick={() => history.goBack()}>Go back</Button>
    </Container>
  </>
}

export default NotFound