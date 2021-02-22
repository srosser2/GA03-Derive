import React, { useState } from 'react'
import { Card } from 'react-bootstrap'

import NewFriendButton from '../components/NewFriendButton'

const Notifications = ({ postFriendRequest, notificationsOn, handleShow, user }) => {

  return <>
    {notificationsOn && <>
      <Card style={{ width: '18rem', position: 'fixed', right: '0' }}>
        <Card.Body>
          <Card.Title>Notifications</Card.Title>
          <Card.Text>
            {user.receivedRequests.length < 1 && <div>No new friends</div>}
            {user.receivedRequests.length > 0 && <>
            {user.receivedRequests.map((e, i) => {
              return <NewFriendButton key={i} data={e} postFriendRequest={postFriendRequest}/>
            })}
            </>}
          </Card.Text>
          <Card.Text>
            {user.comments.length > 0 && console.log(user.comments[0].likes, "likes of the first comment")}
            
          </Card.Text>
          <Card.Link onClick={handleShow}>Close</Card.Link>
        </Card.Body>
      </Card>
      {<img src="http://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Transparent-Picture.png" width="30px" style={{
        position: "fixed",
        left: "92%",
        top: "50px",
        float: "right"
      }}/>}
    </>}
  </>
}

export default Notifications