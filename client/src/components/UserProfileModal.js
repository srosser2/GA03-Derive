import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function UserProfileModal({ user, info, editMode, putUserData }) {
  const [show, setShow] = useState(false)

  // this will have more in it later
  const handleClose = () => {
    setShow(false)
  }

  // this will have more in it later
  const saveChanges = () => {
    putUserData()
  }

  const handleShow = () => {
    if (info[0] === 'countries') return alert('Going to countries page...')
    if (info[0] === 'friends') return alert('Going to friends page...')
    setShow(true)
  }

  return <>
      {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={handleShow}/>}

      <Modal show={show} onHide={() => handleClose()} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* full name and username */}
          {info.length === 2 && <>
            Full Name: <input type="text" placeholder={user[info[0]]}/><br />
            Username: <input type="text" placeholder={user[info[1]]}/>
          </>}
          {/* bio */}
          {info.length === 1 && <>
          <textarea name="Text1" cols="40" rows="10">{user[info[0]]}</textarea></>}
          {/* general info */}
          {info.length === 3 && <>
            Nationality: <input type="text" placeholder={user[info[0]]}/><br />
            Currently travelling?
            <select name="travelling">
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
            <br />
            Languages <input type="text" placeholder={user[info[2]][0]}/><br />
            </>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            saveChanges()
            handleClose()
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
}

export default UserProfileModal