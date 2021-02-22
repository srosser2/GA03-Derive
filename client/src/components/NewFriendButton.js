import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const NewFriendButton = ({ data, postFriendRequest }) => {
  const [isOn, updateIsOn] = useState(true)
  console.log(data)
  return <>
    {isOn && <>
      {data.fullName}
      <Button onClick={() => {
        updateIsOn(false)
        postFriendRequest(data._id, true)
      }}>Accept</Button>
      <Button onClick={() => {
        updateIsOn(false)
        postFriendRequest(data._id, false)
      }}>Reject</Button>
    </>}
  </>
}

export default NewFriendButton