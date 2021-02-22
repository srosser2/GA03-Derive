import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function UserProfileModal({ newModal, toggleNewModal, body }) {

  return <>
      <Modal show={newModal} onHide={() => toggleNewModal()} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggleNewModal()}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}

export default UserProfileModal