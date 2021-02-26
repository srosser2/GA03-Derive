import React from 'react'
import { Container } from 'react-bootstrap'

import NewFriendButton from './NewFriendButton'

const NotificationDisplay = ({ postFriendRequest, notificationsOn, handleShow, user }) => {

  const iconStyle = {
    position: 'fixed',
    left: '92%',
    top: '50px',
    float: 'right'
  }

  return <>
      <Container>
        {user.receivedRequests.length < 1 && <div>No new friends</div>}
        {user.receivedRequests.length > 0 && <>
        {user.receivedRequests.map((e, i) => {
          return <NewFriendButton handleShow={handleShow} key={i} data={e} postFriendRequest={postFriendRequest}/>
        })}
      </>}
      </Container>
      {notificationsOn && <img className='notificationIcon' src="http://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Transparent-Picture.png" width="30px" style={iconStyle}/>}
  </>
}

export default NotificationDisplay