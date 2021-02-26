import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'react-hook-form'
import { getLoggedInUserId } from '../lib/auth'

import Form from '../components/Form.js'
import Modal from '../components/Modal.js'

import Notifications, { notify } from 'react-notify-toast'

const Register = ({ history }) => {

  const [displayModal, updateDisplayModal] = useState(false)
  const [showModal, updateShowModal] = useState(false)
  const [registerForm, updateRegisterForm] = useState({
    fullName: {
      label: 'Full Name',
      element: 'input',
      type: 'text',
      placeholder: 'Enter your full name',
      value: '',
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
      },
      dirty: false
    },
    passwordConfirmation: {
      label: 'Password Confirmation',
      element: 'input',
      type: 'password',
      placeholder: 'Please retype your password',
      value: '',
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

  if (getLoggedInUserId()) history.goBack()

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
    axios.get('/api/countries')
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

  const formControls = {
    submit: {
      handler: () => {
        try {
          const formData = {}
          for (const field in registerForm) {
            formData[field] = registerForm[field].value
            registerForm[field].dirty = true
          }
          updateDisplayModal(true)
          updateShowModal(true)

        } catch (err) {
          notify.show('Error: please fill in the required fields', 'error', 2500)
          console.log(err)
        }
      },
      label: 'Continue',
      classes: ['btn', 'btn-primary']
    }
  }

  const modalFormControls = {
    submit: {
      handler: async () => {
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
          notify.show('Error: please fill in the required fields', 'error', 2500)
          console.log(err)
        }
      },
      label: 'Sign Me Up!',
      classes: ['btn', 'btn-primary']
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

  const modalTitle = <h2>Finish creating your profile</h2>
  const modalBody = <>
    <Form
      config={{ bio: registerForm.bio, nationality: registerForm.nationality, languages: registerForm.languages, isPublic: registerForm.isPublic, isTravelling: registerForm.isTravelling, countriesVisited: registerForm.countriesVisited, countriesWishList: registerForm.countriesWishList }}
      controls={modalFormControls}
      onChange={e => handleModalChange(e)}
      onSelectChange={handleModalSelectChange}
    />
  </>

  return <>
    <Notifications />
    <div className={'registration-container'}>
      <div className={'lhs'}>
        <img src={'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80'} alt={'register'} />
      </div>
      <div className={'rhs'}>
        <div className={'registration-form-container'}>
          <h1>Register</h1>
          <p>Already a member? <span className={'text-link'} onClick={() => history.push('/login')}>Login</span></p>
          <Form
            config={{
              fullName: registerForm.fullName,
              email: registerForm.email,
              password: registerForm.password,
              passwordConfirmation: registerForm.passwordConfirmation
            }}
            controls={formControls}
            onChange={e => handleChange(e)}
            onSelectChange={handleSelectChange}
          />
          <Modal body={modalBody} title={modalTitle} show={showModal} hideModalHandler={() => updateShowModal(false)} />
        </div>

      </div>

    </div>
  </>

}
export default Register