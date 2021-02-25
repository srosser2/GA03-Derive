import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Components
import Form from '../components/Form.js'
import Modal from '../components/Modal.js'
import FileUpload from '../components/FileUpload.js'
import { Container, Card, Button } from 'react-bootstrap'
import Carousel from '../components/Carousel.js'
import { getLoggedInUserId } from '../lib/auth'

const penIcon = 'https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg'

const EditButton = ({ isEditMode, updateIsEditMode }) => {
  return <>
    {isEditMode
      ? <Button onClick={() => updateIsEditMode(!isEditMode)}>Finish editing</Button>
      : <Button onClick={() => updateIsEditMode(!isEditMode)}>Edit profile</Button>}
  </>
}

const AddFriendButton = ({ isPending, updateIsPending, addFriend }) => {
  return <>
    {isPending && <Button>Request pending...</Button>}
    {!isPending && <Button onClick={() => {
      updateIsPending(() => true)
      addFriend()
    }}>Add friend</Button>}
  </>
}

const UserProfile = ({ match }) => {
  const loggedInUser = getLoggedInUserId()

  const [fileUploadPath, updateFileUploadPath] = useState('')
  const [userProfileData, updateUserProfileData] = useState({})
  const [isEditMode, updateIsEditMode] = useState(false)
  const [isPending, updateIsPending] = useState(false)
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

  const [isLoading, updateIsLoading] = useState(true)
  const [selectedModal, updateSelectedModal] = useState('')
  const [showModal, updateShowModal] = useState(false)
  const [currentFriend, updateCurrentFriend] = useState(null)

  useEffect(() => {
    axios.get(`/api/users/${match.params.id}`)
      .then(({ data }) => {
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
        const countriesVisited = data.countriesVisited.map(country => {
          return { label: country.name, value: country._id, flag: country.flag }
        })
        const countriesWishList = data.countriesWishList.map(country => {
          return { label: country.name, value: country._id, flag: country.flag }
        })
        modifiedData.countriesVisited = countriesVisited
        modifiedData.countriesWishList = countriesWishList
        modifiedData.languages = mappedLanguages
        modifiedData.isTravelling = transformedIsTravelling
        updateIsLoading(false)
        updateUserProfileData(modifiedData)
        const formKeys = Object.keys(userForm)
        formKeys.forEach(key => userForm[key].value = modifiedData[key])
      })
      .catch(err => {
        updateIsLoading(false)
      })
    axios.get('/api/languages')
      .then(({ data }) => {
        const languages = data.map(language => {
          return { label: language.name, value: language._id }
        })
        const updatedUserForm = { ...userForm }
        updatedUserForm.languages.options = languages
        updateUserForm(updatedUserForm)
      })
    axios.get('/api/countries')
      .then(({ data }) => {
        const countries = data.map(country => {
          return { label: country.name, value: country._id }
        })
        const updatedUserForm = { ...userForm }
        updatedUserForm.countriesVisited.options = countries
        updatedUserForm.countriesWishList.options = countries
        updateUserForm(updatedUserForm)
      })
  }, [])

  const transformData = {
    incoming: (data) => {
      // Transform data from api call to form friendly format
      
    },
    outgoing: (data) => {
      // Transform data from form to post friendly format
    }
  }

  const formControls = {
    submit: {
      handler: async () => {
        const formData = {}
        for (const field in userForm) {
          formData[field] = userForm[field].value
        }
        try {
          const formData = {}
          for (const field in userForm) {
            formData[field] = userForm[field].value
          }
          formData.languages = formData.languages.map(language => language.value)
          formData.isTravelling = formData.isTravelling.value
          formData.countriesVisited = formData.countriesVisited.map(country => country.value)
          formData.countriesWishList = formData.countriesWishList.map(country => country.value)

          const token = localStorage.getItem('token')
          await axios.put(`/api/users/${loggedInUser.userId}`, formData, { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => {
              const countriesVisited = data.countriesVisited.map(country => {
                return { label: country.name, value: country._id, flag: country.flag }
              })
              const countriesWishList = data.countriesWishList.map(country => {
                return { label: country.name, value: country._id, flag: country.flag }
              })
              const updatedUserForm = { ...userForm }
              updatedUserForm.countriesVisited = countriesVisited
              updatedUserForm.countriesWishList = countriesWishList
              updateUserProfileData(data)
              updateShowModal(false)
            })
            .catch(err => console.log(err))
        } catch (err) {
          alert(err)
        }
      },
      label: 'Continue',
      classes: ['btn', 'btn-primary']
    }
  }

  // Show something while axios is loading
  if (isLoading) {
    return <Container><h1>Loading...</h1></Container>
  }

  function checkCurrentFriendState(){
    console.log("233")
    if (isEditMode) return
    if (userProfileData.friends !== undefined){
      if (userProfileData.friends.map(e => e.friends.includes(userProfileData._id))[0]){
        console.log("237")
        return 
      } else {
        if (userProfileData.receivedRequests.map(e => e.sentRequests.includes(userProfileData._id))[0]){
          console.log("241")
          return <Button>Request pending...</Button>
        } else {
          console.log("244")
          return <AddFriendButton isPending={isPending} updateIsPending={updateIsPending} addFriend={addFriend} />
        }
      }
    }
  }

  // If no user is found from axios, then we don't have an id, so show that the user was not found
  if (!userProfileData._id) {
    return <Container><h1>User not found :(</h1></Container> // add a button to return the user home
  }

  const formHandlers = {
    handleChange(e) {
      const { name, value } = e.target
      const updatedForm = { ...userForm }
      updatedForm[name].value = value
      updateUserForm(updatedForm)
    },
    handleSelectChange(e, name) {
      const updatedForm = { ...userForm }
      updatedForm[name].value = e
      updateUserForm(updatedForm)
    }
  }

  const showEditFieldModalHandler = e => {
    let container = e.target
    while (!container.hasAttribute('id')) {
      container = container.parentElement
    }
    updateSelectedModal(container.id)
    updateShowModal(true)
  }

  // All Content Sections

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = (res) => {
        // resolve(res.target.result);
      };

      reader.onerror = reject

      return reader.readAsArrayBuffer(file);
    })
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = function() {
            resolve(fr.result);
        }
        fr.readAsDataURL(file);
    });
  }

  // THIS WORKS - NEED TO STOR PRESET ON BACKEND
  // const imageUploadHandler = async (e) => {
  //   const cloudURL = 'https://api.cloudinary.com/v1_1/dn39ocqwt/image/upload'
  //   const file = e.target.files[0]
  //   const formData = new FormData()

  //   formData.append('file', file)
  //   formData.append('upload_preset', 'tx2dafyx')

  //   axios.post(cloudURL, formData)
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))
  // }

  const imageUploadHandler = async (e) => {
    const cloudURL = 'https://api.cloudinary.com/v1_1/dn39ocqwt/image/upload'
    const file = e.target.files[0]
    const formData = new FormData()

    // formData.append('file', file)
    // formData.append('upload_preset', 'tx2dafyx')

    
    readAsDataURL(file)
      .then(async (res) => {
        console.log(res.toString())

        const obj = {
          filePath: res
        }

        axios.post('/api/images', obj, {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => console.log(res))
    })

    
  }

  const printLanguages = () => {
    const data = userProfileData.languages.map((e) => {
      return e.name === undefined ? e.label : e.name
    })
    if (data.length < 1) return '-'
    if (data.length === 1) return data[0]
    const lastLanguage = data.pop()
    return (data.join(', ') + ' and ' + lastLanguage)
  }

  const printDate = (input) => {
    const date = new Date(input)
    return date.toDateString()
  }

  async function deleteComment(id, country) {
    const token = localStorage.getItem('token')
    const { data } = await axios.delete(`/api/countries/${country}/comments/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .catch(err => console.log(err, data))
    const updatedUserProfileData = { ...userProfileData }
    updatedUserProfileData.comments = updatedUserProfileData.comments.filter(e => e._id !== id)
    updateUserProfileData(userProfileData)
  }

  const addFriend = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/users/${userProfileData._id}/add`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('friend added')
    } catch (err) {
      console.log(err)
    }
  }

  const userInfo = <div id={'about'} className={'content-block'}>
    <div className={'content-block-header'}>
      <div>{<img src={(userProfileData.profilePicture)} alt="Profile picture"
        style={{ borderRadius: '100%', width: '150px', padding: 5 }} />}</div>
      <h2>{userProfileData.fullName}</h2>{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}
      <h4>{userProfileData.username}</h4>

      {userProfileData.friends !== undefined && checkCurrentFriendState()}

      {userProfileData._id === loggedInUser.userId && <EditButton isEditMode={isEditMode} updateIsEditMode={updateIsEditMode} />}

    </div>
    <div className={'content-block-body'}>
    </div>
  </div>

  const bio = <div id={'bio'}>
    <h3>Bio</h3>{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}
    <Card style={{ minHeight: '100px' }}>{userProfileData.bio}</Card>
  </div>

  const general = <div id={'general'}>
    <h3>General</h3>{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}
    <div>Nationality: {userProfileData.nationality}</div>
    <div>Currently travelling: {userProfileData.isTravelling === true ? 'Yes' : 'No'}</div>
    <div>Lanugages spoken: {userProfileData.languages && printLanguages()}</div>
  </div>

  const countriesVisited = <div id={'countriesVisited'}>
    <h3>Countries</h3>
    <h4>Been to:</h4>{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}
    <Card style={{ width: '45%' }}>
      <Card.Body>
        <Carousel show={3}>
          {userProfileData.countriesVisited.map((e, i) => {
            return <div key={i}>
              <div style={{ padding: 5 }}>
                <a href={`/countries/${e.value}`}><img src={e.flag} alt="country flag" style={{ width: '100%', height: '80px' }}/></a>
              </div>
            </div>
          })}
        </Carousel>
      </Card.Body>
    </Card>
  </div>

  const countriesWishList = <div id={'countriesWishList'}>
    <h4>Wish list:</h4>{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}
    <Card style={{ width: '45%' }}>
      <Card.Body>
        <Carousel show={3}>
          {userProfileData.countriesWishList.map((e, i) => {
            return <div key={i}>
              <div style={{ padding: 5 }}>
                <a href={`/countries/${e.value}`}><img src={e.flag} alt="country flag" style={{ width: '100%', height: '80px' }}/></a>
              </div>
            </div>
          })}
        </Carousel>
      </Card.Body>
    </Card>
  </div>

  const friends = <div id={'friends'}>
    <h3>Friends</h3>{isEditMode && <img src={penIcon} width='30px' onClick={() => alert('going to all friends page...')} />}
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '50%', maxHeight: '200px' }}>
        {userProfileData.friends.slice(0, 8).map((e, i) => {
          if (e._id === undefined) return alert('friend mapping error')
          return <a href={`/users/${e._id}`} key={i}>
            <img src={e.profilePicture} alt={e.username} style={{ borderRadius: '100%', width: '100px', padding: 5 }} />
            <small>{e.username}</small>
          </a>
        })}
      </div>
      <br />
    </div>
  </div>

  const comments = <div id={'comments'}>
    <h3>Comments</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', maxHeight: '30%' }}>
      {userProfileData.comments.map((e, i) => {
        return <>
          <Card style={{ width: '18rem' }} key={i}>
            <Card.Body>
              <Card.Title>{e.country.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{printDate(e.updatedAt)}</Card.Subtitle>
              <Card.Text>
                {e.text}
              </Card.Text>
              <div><small>Likes: {e.likes.length}</small></div>
              {isEditMode && <Button size="sm" variant="outline-danger" onClick={() => deleteComment(e._id, e.country)}>Delete</Button>}
            </Card.Body>
          </Card>
        </>
      })}
    </div>
  </div>

  const images = <div>
    <h2>{userProfileData.fullName}'s Images</h2>
    <FileUpload handleUpload={imageUploadHandler} />
    <div className={'photo-library-container'}>
      {userProfileData.images.map(image => {
        return <div key={image._id} className={'img photo-thumb'}>
          <img src={image.url} id={image._id} className={''} />
        </div>
      })}
    </div>
  </div>

  // Modal Body Logic

  let modalBody

  switch (selectedModal) {
    case 'about':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ fullName: userForm.fullName, username: userForm.username }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
      break
    case 'bio':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ bio: userForm.bio }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
      break
    case 'general':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ nationality: userForm.nationality, isTravelling: userForm.isTravelling, languages: userForm.languages }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
      break
    case 'countriesVisited':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ countriesVisited: userForm.countriesVisited }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
      break
    case 'countriesWishList':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ countriesWishList: userForm.countriesWishList }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
      break
  }

  const modal = <Modal
    title={null}
    body={modalBody}
    show={showModal}
    hideModalHandler={() => updateShowModal(false)} />

  return <>
    <Container>
      {modal}
      {userInfo}
      {bio}
      {images}
      {general}
      {countriesVisited}
      {countriesWishList}
      {friends}
      {comments}
    </Container>

  </>

}

export default UserProfile