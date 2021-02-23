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
      value: '',
      validation: {
        required: true
      }
    },
    fullName: {
      label: 'Full Name',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your full name',
      value: '',
      validation: {
        required: true
      }
    },
    email: {
      label: 'Email',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your email',
      value: 'samtest2@samtest.com',
      validation: {
        required: true,
        isEmail: true
      }
    },
    password: {
      label: 'Password',
      element: 'input',
      type: 'password',
      placeholder: 'Enter your password',
      value: 'sam1234',
      validation: {
        required: true
      }
    },
    passwordConfirmation: {
      label: 'Password Confirmation',
      element: 'input',
      type: 'password',
      placeholder: 'Please retype your password',
      value: 'sam1234',
      validation: {
        required: true
      }
    }
  })
  const [modalForm, updateModalForm] = useState({
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

  useEffect(() => {
    getCountries()
  }, [])
  // * trying to populate countries in the select form (need to do same with languages)
  async function getCountries() {
    const { data } = await axios.get('/api/countries')
    // console.log(data)
    const countries = data.map(e => {
      return { label: e.name, value: e._id }
    })
    const newRegForm = registerForm
    newRegForm.countriesVisited.options = countries
    newRegForm.countriesWishList.options = countries
    // console.log(newRegForm)
    updateRegisterForm(newRegForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...registerForm }
    updatedForm[name].value = value
    updateRegisterForm(updatedForm)
  }
  const handleSelectChange = (e, name) => {
    const updatedForm = { ...modalForm }
    updatedForm[name].value = e.value
    updateModalForm(updatedForm)
    console.log(updatedForm[name])
  }

  const handleSubmit = async () => {
    try {
      const formData = {}
      for (const field in registerForm) {
        formData[field] = registerForm[field].value
      }
      await axios.post('/api/register', formData)
        .then(({ data }) => {
          console.log(data)
        })
      updateDisplayModal(true)
      updateShowModal(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleModalChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...modalForm }
    updatedForm[name].value = value
    updateModalForm(updatedForm)
  }

  const handleModalSubmit = async () => {
    try {
      const formData = {}
      for (const field in modalForm) {
        formData[field] = modalForm[field].value
      }
      await axios.post('/api/register', formData)
        .then(({ data }) => {
          console.log(data)
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
      config={modalForm}
      onSubmit={e => handleModalSubmit(e)} onChange={e => handleModalChange(e)}
      onSelectChange={handleSelectChange} />
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
          config={registerForm}
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
