import React, { useState } from 'react'
import axios from 'axios'

import { Container, Row, Col } from 'react-bootstrap'
import Form from '../components/Form.js'

const Login = ({ history }) => {

  const [loginForm, updateLoginForm] = useState({
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
        required: true,
        minLength: 6
      },
      dirty: false
    }
    // exampleSingleSelect: {
    //   label: 'Test Select',
    //   element: 'select',
    //   value: true,
    //   isMulti: false,
    //   options: [
    //     {
    //       value: true,
    //       label: 'Yes'
    //     },
    //     {
    //       value: false,
    //       label: 'No'
    //     }
    //   ]
    // },
    // exampleMultiSelect: {
    //   label: 'Test Select',
    //   element: 'select',
    //   isMulti: true,
    //   value: [{
    //       value: 'english',
    //       label: 'English'
    //     },
    //     {
    //       value: 'polish',
    //       label: 'Polish'
    //     }],
    //   options: [
    //     {
    //       value: 'english',
    //       label: 'English'
    //     },
    //     {
    //       value: 'polish',
    //       label: 'Polish'
    //     },
    //     {
    //       value: 'spanish',
    //       label: 'Spanish'
    //     }
    //   ]
    // }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...loginForm }
    updatedForm[name].value = value
    updateLoginForm(updatedForm)
  }

  const handleSelectChange = (e, name) => {
    const updatedForm = { ...loginForm }
    updatedForm[name].value = e.value
    updateLoginForm(updatedForm)
    console.log(updatedForm[name])
  }

  const handleSubmit = async () => {
    try {
      const formData = {}
      for (const field in loginForm) {
        formData[field] = loginForm[field].value
        loginForm[field].dirty = true
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
      <Col><h1>Login</h1></Col>
    </Row>

    <Row>
      <Col className={'mb-16'}>
        <Form
          config={loginForm}
          onSubmit={e => handleSubmit(e)} onChange={e => handleChange(e)}
          onSelectChange={handleSelectChange} />
        <button>ABC</button>
      </Col>
      <Col>
      </Col>
    </Row>


  </Container>


}

export default Login