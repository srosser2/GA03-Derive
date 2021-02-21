import React, { useState } from 'react'
import { Container, Row, Col, Media } from 'react-bootstrap'

const Comment = ({ data }) => {
  console.log(data)
  return <Container>
    <Media id={data._id}>
  {/* <img
    width={64}
    height={64}
    className="mr-3"
    src="holder.js/64x64"
    alt="Generic placeholder"
  /> */}
  
  <div 
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
  <Media.Body>
    <div className={'comment-header'}>
      <h5>{data.user.fullName}</h5>
      <div>
        Delete | Edit
      </div>
    </div>
    <p>{data.text}</p> 
    <p>Like</p>
  </Media.Body>
  
</Media>
</Container>
}

export default Comment