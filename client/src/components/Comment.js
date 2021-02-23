import React from 'react'
import { Container, Media } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'

const Comment = ({ data, deleteHandler, editHandler, likeHandler }) => {

  const user = getLoggedInUserId()

  const profilePicture = data.user.profilePicture ? <img
    width={64}
    height={64}
    className='mr-3'
    src={data.user.profilePicture}
    alt='Generic placeholder'
  /> : <div
    className={'mr-3'}
    style={{
      backgroundColor: '#a8a8a8',
      height: '64px',
      width: '64px'
    }}
    width={'64px'}
    height={'64px'}
  >
    &nbsp;
  </div>

  const editDeleteControls = data.user._id === user.userId ?
    <div>
      <span className={'comment-control'} onClick={deleteHandler}>Delete</span> | <span className={'comment-control'} onClick={editHandler}>Edit</span>
    </div> 
    : null


  return <Container id={data._id} className={'comment-container'}>
    <Media>
      {profilePicture}
      <Media.Body>
        <div className={'comment-header'}>
          <h5>{data.user.fullName} - {data.createdAt}</h5>
          {editDeleteControls}
          
        </div>
        <div className={'comment-body'}>
          <p>{data.text}</p>
        </div>
        <div className={'comment-likes'}>
          <p>{data.likes.length === 1 ? `${data.likes.length} Like` : `${data.likes.length} Likes` }</p>
          <p className={'comment-like-comment btn btn-light'} onClick={likeHandler}>Like</p>
        </div>
      </Media.Body>
    </Media>
  </Container>
}

export default Comment