import React from 'react'
import { Button, Modal } from 'react-bootstrap'

function UserProfileModal({ show, hideModalHandler, body, title, size }) {

  return <>
    <Modal show={show} onHide={hideModalHandler} animation={false} size={size ? size : 'md'}>
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModalHandler}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}
export default UserProfileModal