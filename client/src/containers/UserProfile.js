import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Carousel from '../components/Carousel.js'
import Modal from '../components/Modal.js'
import Form from '../components/Form.js'
import 'react-hook-form'

const UserProfile = () => {

  // initial data
  const [user, updateUser] = useState([])
  const [editMode, updatEditMode] = useState(false)
  const [userDisplay, updateUserDisplay] = useState([])

  async function getUserData(userId) {
    // hard coded in a user for now
    const { data } = await axios.get(`/api/users/${userId}`)
    updateUser(data)
    updateUserDisplay(data)
    // for each part of the axios get data, we want to put it in the userForm config
    const formKeys = Object.keys(userForm)
    formKeys.forEach(key => userForm[key].value = data[key])
  }

  function getUserIdFromLocalStorage(){
    const token = localStorage.getItem('token')
    return JSON.parse(atob(token.split('.')[1])).userId
  }

  useEffect(() => {
    const userId = getUserIdFromLocalStorage()
    getUserData(userId)
  }, [])

  const [userForm, updateUserForm] = useState({
    fullName: {
      label: 'Name',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    },
    username: {
      label: 'Username',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    },
    bio: {
      label: 'Bio',
      element: 'textarea',
      value: '',
      validation: {
        required: true
      }
    },
    nationality: {
      label: 'Nationality',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    },
    languages: {
      label: 'Languages spoken',
      element: 'input',
      type: 'array',
      value: '',
      validation: {
        required: true
      }
    },
    isTravelling: {
      label: 'Currently travelling?',
      element: 'select',
      value: '',
      options: [
        {
          label: 'Yes',
          value: true
        },
        {
          label: 'No',
          value: false
        }
      ],
      validation: {
        required: true
      }
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...userForm }
    updatedForm[name].value = value
    updateUserForm(updatedForm)
  }

  const handleSubmit = async () => {
    try {
      const formData = {}
      for (const field in userForm) {
        formData[field] = userForm[field].value
      }
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).userId
      const { data } = await axios.put(`/api/users/${userId}`, formData, { headers: { "Authorization" : `Bearer ${token}` } }).catch(err => console.log(err))
      setNewModal(!newModal)
      updateUserDisplay(formData)
    } catch (err) {
      console.log(err)
    }
  }

  const [newModal, setNewModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  function toggleNewModal(input){
    switch (input){
      case 'nameUser':
        setModalContent('nameUser')
        break
      case 'bio':
        setModalContent('bio')
        break
      case 'formGeneral':
        setModalContent('formGeneral')
        break
    }
    setNewModal(!newModal)
  }

  const EditButton = ({ toggleNewModal, toggle, editMode }) => {
    return <>
      {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => toggleNewModal(toggle)}/>}
    </>
  }

  let modalBody 
  switch (modalContent){
    case 'nameUser':
      modalBody = <Form config={{ fullName: userForm.fullName, username: userForm.username }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
    case 'bio':
      modalBody = <Form config={{ bio: userForm.bio }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
    case 'formGeneral':
      modalBody = <Form config={{ nationality: userForm.nationality, isTravelling: userForm.isTravelling, languages: userForm.languages }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
  }

  function printLanguages(){
    if (userDisplay.languages.length < 1) return '-'
    if (userDisplay.languages.length === 1) return userDisplay.languages
    const languages = userDisplay.languages
    const lastLanguage = languages.pop()
    return (languages.join(', ') + ' and ' + lastLanguage)
  }
  
  return <>
    <h1>User Profile</h1>
    {!editMode && <Button variant="primary" onClick={() => updatEditMode(!editMode)}>Edit Profile</Button>}
    {editMode && <Button variant="warning" onClick={() => updatEditMode(!editMode)}>Finish Editing</Button>}

    <Modal body={modalBody} newModal={newModal} toggleNewModal={() => toggleNewModal()}/>
  
    <EditButton toggleNewModal={toggleNewModal} toggle={'nameUser'} editMode={editMode}/>
    <div>Name: {userDisplay.fullName && userDisplay.fullName}</div>
    <div>Username: {userDisplay.username && userDisplay.username}</div>

    {user.isPublic && <>

      <div>
        <EditButton toggleNewModal={toggleNewModal} toggle={'bio'} editMode={editMode}/>
        Bio:
        <br />
        <div>&quot;{userDisplay.bio && userDisplay.bio}&quot;</div> 
      </div>

      <div>
        <EditButton toggleNewModal={toggleNewModal} toggle={'formGeneral'} editMode={editMode}/>
        <div>Nationality: {userDisplay.nationality && userDisplay.nationality}</div>
        Currently Travelling: {userDisplay.isTravelling && userDisplay.isTravelling === true ? 'Yes' : 'No'}
        <div>Lanuages Spoken: {userDisplay.languages && printLanguages()}</div>
      </div>

      <div>
        {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => alert('going to countries page...')}/>}
        Countries Visited: 
        <br />
        <div style={{ width: '45%' }}>
          <Carousel show={3}>
            {/* this data is an array, so the value in the form is different and presents a problem */}
            {user.countriesVisited.map((e, i) => {
              return <div key={i}>
                <div style={{ padding: 5 }}>
                  <img src={e.flag} alt="country flag" style={{ width: '100%' }} />
                </div>
              </div>
            })}
          </Carousel>
        </div>
      </div>

      <div>
        {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => alert('going to friends page...')}/>}
        Friends: 
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '50%', height: '200px' }}>
          {user.friends.map((e, i) => {
            return <div key={i}>
              <img src="https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg" alt="placeholder" style={{ borderRadius: '100%', width: '100px', padding: 5 }} />
              <small>{user.friends[i].username}</small>
            </div>
          })}
        </div>
      </div>
      <br />

    </>}
  </>
}

export default UserProfile