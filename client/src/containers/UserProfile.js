import React, { useState, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import axios from 'axios'
import Carousel from '../components/Carousel.js'
import Modal from '../components/Modal.js'
import Form from '../components/Form.js'
import 'react-hook-form'

const AddFriendButton = ({ user, match }) => {

  const token = localStorage.getItem('token')

  const currentFriendState = () => {
    if (user.receivedRequests.map(e => e.sentRequests.includes(user._id))[0]){
      return <Button>Pending...</Button>
    } else {
      return <Button onClick={() => addFriend()}>Add friend</Button>
    }
  }

  const addFriend = async () => {
    const { data } = await axios.post(`/api/users/${match.params.id}/add`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.log(err))
    console.log(data, 'added friend')
  }

  return <>{user.receivedRequests && <>{currentFriendState()}</>}</>
}

const UserProfile = ({ match }) => {

  // initial data
  const [user, updateUser] = useState([])
  const [editMode, updatEditMode] = useState(false)
  const [userDisplay, updateUserDisplay] = useState([])
  
  // check if the user we're looking for is the current user?
  const [isUser, updateIsUser] = useState(isUserLoggedInUser())
  
  function isUserLoggedInUser(){
    const token = localStorage.getItem('token')
    if (!token) return false
    const userId = JSON.parse(atob(token.split('.')[1])).userId
    if (!match.params.id) return true
    if (match.params.id !== userId) return false
    if (match.params.id === userId) return true 
  }

  async function getUserData(userId) {
    const { data } = await axios.get(`/api/users/${userId}`)
    console.log(data)
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
    let userId
    isUserLoggedInUser() ? userId = getUserIdFromLocalStorage() : userId = match.params.id
    getUserData(userId)
    getLanguages()
  }, [])

  async function getLanguages(){
    const { data } = await axios.get('/api/languages')
    const langs = data.map(e => {
      return { label: e.name, value: e.name }
    })
    const copy = userForm
    copy.languages.options = langs
    updateUserForm(copy)
  }

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
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [
        {
          label: 'English',
          value: 'English'
        }
      ],
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

  const handleSelectChange = (e, name) => {
    const updatedForm = { ...userForm }
    console.log(name, "name", e, "e")
    updatedForm[name].value = e
    updateUserForm(updatedForm)
    console.log(updatedForm, "updated form")
    console.log(updatedForm[name], "updated form name")
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
      console.log(formData, "the form data")
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
      modalBody = <Form onSelectChange={handleSelectChange} config={{ fullName: userForm.fullName, username: userForm.username }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
    case 'bio':
      modalBody = <Form onSelectChange={handleSelectChange} config={{ bio: userForm.bio }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
    case 'formGeneral':
      modalBody = <Form onSelectChange={handleSelectChange} config={{ nationality: userForm.nationality, isTravelling: userForm.isTravelling, languages: userForm.languages }} onSubmit={handleSubmit} onChange={handleChange}/>
      break
  }

  function printLanguages(){
    const data = userDisplay.languages.map(e => e.label)
    if (data.length < 1) return '-'
    if (data.length === 1) return data[0]
    const lastLanguage = data.pop()
    return (data.join(', ') + ' and ' + lastLanguage)
  }

  function printDate(input){
    const date = new Date(input)
    return date.toDateString()
  }

  async function deleteComment(id, country){
    const token = localStorage.getItem('token')
    const { data } = await axios.delete(`/api/countries/${country}/comments/${id}`, { headers: { "Authorization" : `Bearer ${token}` } }).catch(err => console.log(err))
    console.log(data, "comment deleted")
    updateUser(user)
    updateUserDisplay(user)
  }

  
  return <>

    <h1>User Profile</h1>
    <img src="https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg" alt="profile picture" width="10%"/>
    {isUser && <>
      {!editMode && <Button variant="primary" onClick={() => updatEditMode(!editMode)}>Edit Profile</Button>}
      {editMode && <Button variant="warning" onClick={() => updatEditMode(!editMode)}>Finish Editing</Button>}
      </>}

    <Modal body={modalBody} newModal={newModal} toggleNewModal={() => toggleNewModal()}/>
  
    {isUser && <EditButton toggleNewModal={toggleNewModal} toggle={'nameUser'} editMode={editMode}/>}

    {!isUser && <AddFriendButton user={user} updateUser={updateUser} match={match}/>}
    <div>Name: {userDisplay.fullName && userDisplay.fullName}</div>
    <div>Username: {userDisplay.username && userDisplay.username}</div>

    {user.isPublic && <>

      <div>
        <EditButton toggleNewModal={toggleNewModal} toggle={'bio'} editMode={editMode}/>
        Bio:
        <br />
        <div>&quot;{userDisplay.bio && userDisplay.bio}&quot;</div> 
      </div>

      {userDisplay.languages && console.log(userDisplay.languages)}

      <div>
        <EditButton toggleNewModal={toggleNewModal} toggle={'formGeneral'} editMode={editMode}/>
        <div>Nationality: {userDisplay.nationality && userDisplay.nationality}</div>
        Currently Travelling: {userDisplay.isTravelling && userDisplay.isTravelling.value === true ? 'Yes' : 'No'}
        <div>Lanuages Spoken: {userDisplay.languages && printLanguages()}</div>
      </div>

      <div>
        {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => alert('going to countries page...')}/>}
        Countries Visited: 
        <br />
        <Card style={{ width: '45%' }}>
          <Card.Body>
            <Carousel show={3}>
              {user.countriesVisited.length < 1 && <Button>Add some countries</Button>}
              {user.countriesVisited.map((e, i) => {
                return <div key={i}>
                  <div style={{ padding: 5 }}>
                    <img src={e.flag} alt="country flag" style={{ width: '100%' }} />
                  </div>
                </div>
              })}
            </Carousel>
          </Card.Body>
        </Card>
      </div>

      <div>
        {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => alert('going to countries page...')}/>}
        Countries Wishlist: 
        <br />
        <Card style={{ width: '45%' }}>
          <Card.Body>
            <Carousel show={3}>
              {user.countriesWishList.length < 1 && <Button>Add some countries</Button>}
              {user.countriesWishList.map((e, i) => {
                return <div key={i}>
                  <div style={{ padding: 5 }}>
                    <img src={e.flag} alt="country flag" style={{ width: '100%' }} />
                  </div>
                </div>
              })}
            </Carousel>
          </Card.Body>
        </Card>
      </div>

      <div>
        {editMode && <img src='https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg' width='30px' onClick={() => alert('going to friends page...')}/>}
        Friends: 
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '50%', maxHeight: '200px' }}>
          {user.friends.map((e, i) => {
            return <div key={i}>
              <img src="https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg" alt="placeholder" style={{ borderRadius: '100%', width: '100px', padding: 5 }} />
              <small>{user.friends[i].username}</small>
            </div>
          })}
        </div>
        <br />
        <Button size="sm" variant="primary" onClick={() => alert('going to all friends page...')}>See all friends</Button>
      </div>

      {isUser && <>
      <div>
        <h3>Recent posts:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxHeight: '30%' }}>
          {user.comments.map((e, i) => {
            return <>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{e.country.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{printDate(e.updatedAt)}</Card.Subtitle>
                <Card.Text>
                  {e.text}
                </Card.Text>
                <div><small>Likes: {e.likes.length}</small></div>
                
                {editMode && <Button size="sm" variant="outline-danger" onClick={() => deleteComment(e._id, e.country)}>Delete</Button>}
              </Card.Body>
            </Card>
            </>
          })}
        </div>
      </div>
      </>}
    </>}
  </>

}

export default UserProfile