import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap'

const NewFriendButton = ({ data, postFriendRequest, handleShow }) => {
  const [isOn, updateIsOn] = useState(true)
  console.log(data)
  return <>
    {isOn && <>
    <Container>
      {data.fullName}
      <Button onClick={() => {
        updateIsOn(false)
        handleShow()
        postFriendRequest(data._id, true)
      }}>Accept</Button>
      <Button onClick={() => {
        updateIsOn(false)
        handleShow()
        postFriendRequest(data._id, false)
      }}>Reject</Button>
    </Container>
    </>}
  </>
}

export default NewFriendButton