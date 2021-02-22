import React, { useState } from 'react'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap'

import Form from '../components/Form.js'

const Register = ({ history }) => {

  const [registerForm, updateRegisterForm] = useState({
    email: {
      label: 'Email',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your email',
      value: '',
      validation: {
        required: true
      }
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
      const { data } = await axios.post('/api/login', formData).catch(err => console.log(err))
      localStorage.setItem('token', data.token)
      history.push('/user')
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