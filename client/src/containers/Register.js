import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap'
import 'react-hook-form'

import Form from '../components/Form.js'
import Modal from '../components/Modal.js'

const Register = ({ history }) => {

  const [displayModal, updateDisplayModal] = useState(false)
  const [showModal, updateShowModal] = useState(false)
  const [registerForm, updateRegisterForm] = useState({
    username: {
      label: 'Username',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your username',
      value: 'hannah',
      validation: {
        required: true
      },
      dirty: false
    },
    fullName: {
      label: 'Full Name',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your full name',
      value: 'hannah',
      validation: {
        required: true
      },
      dirty: false
    },
    email: {
      label: 'Email',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your email',
      value: 'hannah@hananh.com',
      validation: {
        required: true,
        isEmail: true
      },
      dirty: false
    },
    password: {
      label: 'Password',
      element: 'input',
      type: 'password',
      placeholder: 'Enter your password',
      value: 'hannah',
      validation: {
        required: true
      },
      dirty: false
    },
    passwordConfirmation: {
      label: 'Password Confirmation',
      element: 'input',
      type: 'password',
      placeholder: 'Please retype your password',
      value: 'hannah',
      validation: {
        required: true
      },
      dirty: false
    },
    bio: {
      label: 'Bio',
      element: 'input',
      type: 'text',
      placeholder: 'Tell us a bit about yourself',
      value: '',
      validation: {
        required: false
      }
    },
    nationality: {
      label: 'Nationality',
      element: 'input',
      type: 'text',
      placeholder: 'Your nationality',
      value: '',
      validation: {
        required: false
      }
    },
    languages: {
      label: 'Languages spoken',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [],
      validation: {
        required: false
      }
    },
    isPublic: {
      label: 'Profile visibility',
      element: 'select',
      value: 'false',
      options: [
        {
          label: 'Public',
          value: true
        },
        {
          label: 'Private',
          value: false
        }
      ],
      validation: {
        required: false
      }
    },
    isTravelling: {
      label: 'Currently travelling?',
      element: 'select',
      value: 'false',
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
        required: false
      }
    },
    countriesVisited: {
      label: 'Countries you\'ve visited',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [

      ],
      validation: {
        required: false
      }
    },
    countriesWishList: {
      label: 'Which countries would you like to visit?',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [],
      validation: {
        required: false
      }
    }
  })

  // ? this has been udpated to reflect one big form
  useEffect(() => {
    axios.get('/api/languages')
      .then(({ data }) => {
        const languages = data.map(language => {
          return { label: language.name, value: language._id }
        })
        const newModalForm = { ...registerForm }
        newModalForm.languages.options = languages
        updateRegisterForm(newModalForm)
      })
    axios.get('api/countries')
      .then(({ data }) => {
        const countries = data.map(country => {
          return { label: country.name, value: country._id }
        })
        const newModalForm = { ...registerForm }
        newModalForm.countriesVisited.options = countries
        newModalForm.countriesWishList.options = countries
        updateRegisterForm(newModalForm)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...registerForm }
    updatedForm[name].value = value
    updateRegisterForm(updatedForm)
  }
  
  const handleSelectChange = (e, name) => {
    const updatedForm = { ...registerForm }
    updatedForm[name].value = e.value
    updateRegisterForm(updatedForm)
  }

  const handleSubmit = () => {
    try {
      const formData = {}
      for (const field in registerForm) {
        formData[field] = registerForm[field].value
        registerForm[field].dirty = true
      }
      updateDisplayModal(true)
      updateShowModal(true)

    } catch (err) {
      console.log(err)
    }
  }

  const handleModalChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...registerForm }
    updatedForm[name].value = value
    updateRegisterForm(updatedForm)
  }

  const handleModalSelectChange = (e, name) => {
    const updatedForm = { ...registerForm }
    updatedForm[name].value = e
    updateRegisterForm(updatedForm)
  }

  const handleModalSubmit = async () => {
    try {
      const formData = {}
      for (const field in registerForm) {
        formData[field] = registerForm[field].value
      }
      formData.languages = registerForm.languages.value.map(language => language.value)
      formData.isTravelling = registerForm.isTravelling.value.value
      formData.isPublic = registerForm.isPublic.value.value

      formData.countriesVisited = registerForm.countriesVisited.value.map(country => country.value)
      formData.countriesWishList = registerForm.countriesWishList.value.map(country => country.value)
      await axios.post('/api/register', formData)
        .then(({ data }) => {
          console.log('I have registered', data)
        })
      updateDisplayModal(false)
      updateShowModal(false)
      history.push('/login')
    } catch (err) {
      console.log(err)
    }
  }

  let modalTitle = null
  modalTitle = <h2>Finish creating your profile</h2>
  let modalBody = null
  modalBody = <> 
    <Form
      config={{ bio: registerForm.bio, nationality: registerForm.nationality, languages: registerForm.languages, isPublic: registerForm.isPublic, isTravelling: registerForm.isTravelling, countriesVisited: registerForm.countriesVisited, countriesWishList: registerForm.countriesWishList }}
      onSubmit={e => handleModalSubmit(e)} onChange={e => handleModalChange(e)}
      onSelectChange={handleModalSelectChange} />
  </>

  return <Container>
    <Row>
      <Col><h1>Register</h1></Col>
    </Row>
    <Row>
      <p>All fields are required</p>
    </Row>
    <Row>
      <Col className={'mb-16'}>
        <Form
          config={{ fullName: registerForm.fullName, username: registerForm.username, email: registerForm.email, password: registerForm.password, passwordConfirmation: registerForm.passwordConfirmation }}
          onSubmit={e => handleSubmit(e)} onChange={e => handleChange(e)}
          onSelectChange={handleSelectChange} />
      </Col>
      <Col>
        <Modal body={modalBody} title={modalTitle} show={showModal} hideModalHandler={() => updateShowModal(false)} />
      </Col>
    </Row>
  </Container>
}
export default Register
