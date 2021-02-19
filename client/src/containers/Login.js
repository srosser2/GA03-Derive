import React, { useState } from 'react'
import axios from 'axios'

import Form from '../components/Form.js'

const Login = ({ history }) => {

  const [loginForm, updateLoginForm] = useState({
    email: {
      label: 'Email',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    },
    password: {
      label: 'Password',
      element: 'input',
      type: 'password',
      value: '',
      validation: {
        required: true
      }
    }
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...loginForm }
    updatedForm[name].value = value
    updateLoginForm(updatedForm)
  }

  const handleSubmit = async () => {
    try {
      const formData = {}
      for (const field in loginForm) {
        formData[field] = loginForm[field].value
      }
      const { data } = await axios.post('/api/login', formData).catch(err => console.log(err))
      localStorage.setItem('token', data.token)
      history.push('/user')
    } catch (err) {
      console.log(err)
    }
  }

  return <div>
    <h1>Login</h1>
    <Form config={loginForm} onSubmit={e => handleSubmit(e)} onChange={e => handleChange(e)} />
  </div>


}
 
export default Login