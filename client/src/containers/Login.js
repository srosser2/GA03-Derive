import React, { useState } from 'react'
import axios from 'axios'
import { getLoggedInUserId } from '../lib/auth'

import Form from '../components/Form.js'

import Notifications, { notify } from 'react-notify-toast'

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
  })

  const formControls = {
    submit: {
      label: 'Sign In',
      handler: async () => {
        try {
          const formData = {}
          for (const field in loginForm) {
            formData[field] = loginForm[field].value
            loginForm[field].dirty = true
          }
          const { data } = await axios.post('/api/login', formData).catch(err => console.log(err))
          console.log(data)
          localStorage.setItem('token', data.token)
          history.push(`/users/${getLoggedInUserId().userId}`)
        } catch (err) {
          console.log(err)
          notify.show('Error: please fill in all the required fields', 'error', 2500)
        }
      },
      classes: [
        'btn',
        'btn-primary'
      ]
    },
    cancel: {
      label: 'Cancel',
      handler: () => {
        history.push('/')
      },
      classes: [
        'btn',
        'btn-secondary'
      ]
    }
  }

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
  }


  return <div className={'registration-outer-container'}>
  <Notifications />
  <div className={'registration-container'}>
    <div className={'lhs'}>
      <img src={'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80'} alt={'register'}/>
    </div>
    <div className={'rhs'}>
      <div className={'registration-form-container'}>
        <h1>Sign In</h1>
        <Form
          config={loginForm}
          controls={formControls}
          onChange={e => handleChange(e)}
          onSelectChange={handleSelectChange} />
      </div>

    </div>
      
  </div>
  </div>

}

export default Login