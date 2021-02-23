import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Components
import Form from '../components/Form.js'
import Modal from '../components/Modal.js'
import { Container } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth'

const UserProfile = ({ match }) => {

  const loggedInUser = getLoggedInUserId()
  // console.log(loggedInUser)

  const [userProfileData, updateUserProfileData] = useState({})
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
      validation: {}
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
      validation: {}
    },
    isTravelling: {
      label: 'Currently travelling?',
      element: 'select',
      value: false,
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
      validation: {}
    }
  })

  const [isLoading, updateIsLoading] = useState(true)
  const [selectedModal, updateSelectedModal] = useState('')
  const [showModal, updateShowModal] = useState(false)
  

  useEffect(() => {
    axios.get(`/api/users/${match.params.id}`)
      .then(({ data }) => {
        console.log(data)
        const modifiedData = { ...data }
        const mappedLanguages = modifiedData.languages.map(language => {
          return {
            value: language._id,
            label: language.name
          }
        })
        const transformedIsTravelling = {
          value: modifiedData.isTravelling,
          label: modifiedData.isTravelling === true ? 'Yes' : 'No'
        }
        modifiedData.languages = mappedLanguages
        modifiedData.isTravelling = transformedIsTravelling
        updateIsLoading(false)
        updateUserProfileData(modifiedData)
        const formKeys = Object.keys(userForm)
        formKeys.forEach(key => userForm[key].value = modifiedData[key])
      })
      .catch(err => {
        console.log(err)
        updateIsLoading(false)
      })
    axios.get('/api/languages')
      .then(({ data }) => {
        const languages = data.map(language => {
          return { label: language.name, value: language._id }
        })
        const updatedUserForm =  { ...userForm }
        updatedUserForm.languages.options = languages
        updateUserForm(updatedUserForm)
      })
      
  }, [])

  // Show something while axios is loading
  if (isLoading) {
    return <h1>Loading</h1>
  }

  // If no user is found from axios, then we don't have an id, so show that the user was not found
  if (!userProfileData._id) {
    return <h1>User not found :(</h1> // add a button to return the user home
  }

  const formHandlers = {
    handleChange(e){
      const { name, value } = e.target
      const updatedForm = { ...userForm }
      updatedForm[name].value = value
      updateUserForm(updatedForm)
    },
    handleSelectChange(e, name){

      const updatedForm = { ...userForm }
      updatedForm[name].value = e
      // console.log(updatedForm[name])

      updateUserForm(updatedForm)
    },
    async handleSubmit(){
      const formData = {}
      for (const field in userForm) {
        formData[field] = userForm[field].value
      }
      /**
       * languages  [{'label': 'Russian', value: 'a;sdfkljas;f;'}]
       */

      try {
        const formData = {}
        for (const field in userForm) {
          formData[field] = userForm[field].value
        }
        formData.languages = formData.languages.map(language => language.value)
        formData.isTravelling = formData.isTravelling.value

        const token = localStorage.getItem('token')
        await axios.put(`/api/users/${loggedInUser.userId}`, formData, { headers: { Authorization: `Bearer ${token}` } })
          .then(({ data }) => {
            updateUserProfileData(data)
            updateShowModal(false)
          })
          .catch(err => alert(err))
      } catch (err) {
        alert(err)
      }
    }
  }

  const showEditFieldModalHandler = e => {
    let container = e.target
    while (!container.hasAttribute('id')) {
      container = container.parentElement
    }
    console.log(container.id)
    updateSelectedModal(container.id)
    updateShowModal(true)
  }

  // const printLanguages = () => {
  //   const data = userDisplay.languages.map(e => e.label)
  //   if (data.length < 1) return '-'
  //   if (data.length === 1) return data[0]
  //   const lastLanguage = data.pop()
  //   return (data.join(', ') + ' and ' + lastLanguage)
  // }


  // All Content Sections

  let body

  // If we find a user, but it's not the logged in user
  if (userProfileData._id !== loggedInUser.userId) {
    body = <h1>This isn't you, but that's ok</h1>
  }

  // If we find a user and it's us, show edit controls
  if (userProfileData._id === loggedInUser.userId) {
    body = <h1>It's You</h1>
  }

  const userInfo = <div id={'about'} className={'content-block'}>
    <div className={'content-block-header'}>
      <h2>About {userProfileData.fullName}</h2>
      {userProfileData._id === loggedInUser.userId ? <button onClick={showEditFieldModalHandler}>Edit field</button> : null}
    </div>
    <div className={'content-block-body'}>
    </div>
  </div>

  const bio = <div id={'bio'}>
    <h2>Bio</h2>
    {userProfileData._id === loggedInUser.userId ? <button onClick={showEditFieldModalHandler}>Edit field</button> : null}
  </div>

  const countries = <div id={'general'}>
    <h2>General</h2>
    {userProfileData._id === loggedInUser.userId ? <button onClick={showEditFieldModalHandler}>Edit field</button> : null}
  </div>

  const comments = <div id={'comments'}>
    <h2>Comments</h2>
    {userProfileData._id === loggedInUser.userId ? <button onClick={showEditFieldModalHandler} >Edit field</button> : null}
  </div>

  // Modal Body Logic

  let modalBody

  switch (selectedModal){
    case 'about':
      modalBody = <Form onSelectChange={formHandlers.handleSelectChange} config={{ fullName: userForm.fullName, username: userForm.username }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange}/>
      break
    case 'bio':
      modalBody = <Form onSelectChange={formHandlers.handleSelectChange} config={{ bio: userForm.bio }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange}/>
      break
    case 'general':
      modalBody = <Form onSelectChange={formHandlers.handleSelectChange} config={{ nationality: userForm.nationality, isTravelling: userForm.isTravelling, languages: userForm.languages }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange}/>
      break
  }

  const modal  = <Modal 
    title={null}
    body={modalBody} 
    show={showModal} 
    hideModalHandler={() => updateShowModal(false)}/>

  return <>
    <Container>
      {modal}
      {body}
      {userInfo}
      {bio}
      {countries}
      {comments}
    </Container>
    
  </>

}

export default UserProfile