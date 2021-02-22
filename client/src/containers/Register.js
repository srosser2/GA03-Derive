import React, { useState } from 'react'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap'
import Form from '../components/Form.js'
import 'react-hook-form'


const Register = ({ history }) => {
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
      value: '',
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
      value: '',
      validation: {
        required: true
      }
    },
    passwordConfirmation: {
      label: 'Password Confirmation',
      element: 'input',
      type: 'password',
      placeholder: 'Please retype your password',
      value: '',
      validation: {
        required: true
      }
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
      value: '',
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
        required: false
      }
    },
    countriesVisited: {
      label: 'Countries you\'ve visited',
      element: 'select',
      type: 'select',
      isMulti: true,
      value: [],
      options: [],
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
    console.log(updatedForm[name])
  }
  const handleSubmit = async () => {
    try {
      const formData = {}
      for (const field in registerForm) {
        formData[field] = registerForm[field].value
      }
      const { data } = await axios.post('/api/register', formData).catch(err => console.log(err))
      console.log(data)
      history.push('/login')
    } catch (err) {
      console.log(err)
    }
  }
  return <Container>
    <Row>
      <Col><h1>Register</h1></Col>
    </Row>
    <Row>
      <Col className={'mb-16'}>
        <Form
          config={registerForm}
          onSubmit={e => handleSubmit(e)} onChange={e => handleChange(e)}
          onSelectChange={handleSelectChange} />
      </Col>
      <Col>
      </Col>
    </Row>
  </Container>
}
export default Register