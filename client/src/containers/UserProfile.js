import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Components
import Form from '../components/Form.js'
import Modal from '../components/Modal.js'
import FileUpload from '../components/FileUpload.js'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import Carousel from '../components/Carousel.js'
import { getLoggedInUserId } from '../lib/auth'
import NavBar from '../components/Navbar'

const penIcon = 'https://t4.ftcdn.net/jpg/01/09/40/45/240_F_109404594_0N0O1Yki0kGrODecWMvVt3qettBtzWtq.jpg'

const EditButton = ({ isEditMode, updateIsEditMode }) => {
  return <>
    {isEditMode
      ? <Button variant="outline-success" onClick={() => updateIsEditMode(!isEditMode)}>Finish editing</Button>
      : <Button variant="outline-primary" onClick={() => updateIsEditMode(!isEditMode)}>Edit profile</Button>}
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

  const transformData = {
    mapArrayToSelectOptions: (obj, key, val, lab) => {
      return obj[key].map(item => {
        return {
          ...item,
          value: item[val],
          label: item[lab]
        }
      })
    },
    incoming: (data) => {
      // Transform data from api call to form friendly format
      const transformedData = { ...data }
      const mapArrayToSelectOptions = (obj, key, val, lab) => {
        return obj[key].map(item => {
          return {
            ...item,
            value: item[val],
            label: item[lab]
          }
        })
      }
      const countriesVisited = mapArrayToSelectOptions(transformedData, 'countriesVisited', '_id', 'name')
      const countriesWishList = mapArrayToSelectOptions(transformedData, 'countriesWishList', '_id', 'name')
      const languages = mapArrayToSelectOptions(transformedData, 'languages', '_id', 'name')
      transformedData.countriesVisited = countriesVisited
      transformedData.countriesWishList = countriesWishList
      transformedData.languages = languages
      transformedData.isTravelling = { value: transformedData.isTravelling, label: transformedData.isTravelling ? 'Yes' : 'No' }
      transformedData.isPublic = { value: transformedData.isPublic, label: transformedData.isPublic ? 'Yes' : 'No' }
      return transformedData

    }
  }

  useEffect(() => {
    axios.get(`/api/users/${match.params.id}`)
      .then(({ data }) => {
        const modifiedData = transformData.incoming({ ...data })
        updateIsLoading(false)
        updateUserProfileData(modifiedData)
        const formKeys = Object.keys(userForm)
        formKeys.forEach(key => userForm[key].value = modifiedData[key])
        // updateUserForm()
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
        const updatedUserForm = { ...userForm }
        console.log(languages)
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
              const modifiedData = transformData.incoming({ ...data })
              const updatedUserForm = { ...userForm }
              updateUserProfileData(modifiedData)
              const formKeys = Object.keys(userForm)
              formKeys.forEach(key => updatedUserForm[key].value = modifiedData[key])
              updateUserForm(updatedUserForm)
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

  function checkCurrentFriendState() {
    if (isEditMode) return
    if (userProfileData.friends !== undefined) {
      if (userProfileData.friends.map(e => e.friends.includes(userProfileData._id))[0]) {
        return
      } else {
        if (userProfileData.receivedRequests.map(e => e.sentRequests.includes(userProfileData._id))[0]) {
          return <Button>Request pending...</Button>
        } else {
          return <AddFriendButton isPending={isPending} updateIsPending={updateIsPending} addFriend={addFriend} />
        }
      }
    }
  }

  // If no user is found from axios, then we don't have an id, so show that the user was not found
  if (!userProfileData._id) {
<<<<<<< HEAD
    // add a button to return the user home
    return <Container><h1>User not found :(</h1></Container>
=======
    return <Container><h1>User not found :(</h1></Container> // add a button to return the user home
>>>>>>> development
  }

  const formHandlers = {
    handleChange(e) {
      const { name, value } = e.target
      const updatedForm = { ...userForm }
      updatedForm[name].value = value
      updateUserForm(updatedForm)
    },
    handleSelectChange(e, name) {
      console.log(e)
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
      let reader = new FileReader()
      reader.onload = (res) => {
        // resolve(res.target.result);
      }
      reader.onerror = reject
      return reader.readAsArrayBuffer(file)
    })
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onerror = reject
      fr.onload = function () {
        resolve(fr.result)
      }
      fr.readAsDataURL(file)
    })
  }

  const imageUploadHandler = async (e) => {
    const file = e.target.files[0]

    readAsDataURL(file)
      .then(async (res) => {
        console.log(res.toString())

        const obj = {
          filePath: res
        }

        axios.post('/api/images', obj, {
          headers: {
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
    <Card className='profileCard'>
      <div className={'content-block-header'}>
        <div className="justifySpaceBetween">
          <img src={(userProfileData.profilePicture
            ? userProfileData.profilePicture
            : 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg')} alt="Profile picture" style={{ borderRadius: '100%', width: '150px', padding: 5 }} />
          <div>
            {userProfileData._id === loggedInUser.userId && <EditButton isEditMode={isEditMode} updateIsEditMode={updateIsEditMode} />}
            {userProfileData.friends !== undefined && checkCurrentFriendState()}
          </div>
        </div>
        <h2>{userProfileData.fullName}{isEditMode && <img className="fade-in" src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}</h2>
        <h4>{userProfileData.username}</h4>
      </div>
      <div className={'content-block-body'}>
      </div>
    </Card>
  </div>

  const general = <div id={'general'}>
    <Card className='profileCard'>
      <h3>General{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}</h3>
      <div>Nationality: {userProfileData.nationality}</div>
      <div>Currently travelling: {userProfileData.isTravelling === true ? 'Yes' : 'No'}</div>
      <div>Lanugages spoken: {userProfileData.languages && printLanguages()}</div>
    </Card>
  </div>

  const bio = <div id={'bio'}>
    <Card className='profileCard' style={{ minHeight: '100px' }}>
      <h3>Bio{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}</h3>
      {userProfileData.bio}
    </Card>
  </div>

  const countriesVisited = <div id={'countriesVisited'}>

    <h3>Countries</h3>
    <h4>Been to:{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}</h4>
    <Card style={{ width: '45%' }}>
      <Card.Body>
        <Carousel show={3}>
          {userProfileData.countriesVisited.map((e, i) => {
            return <div key={i}>
              <div style={{ padding: 5 }}>
                <a href={`/countries/${e.value}`}><img src={e.flag} alt="country flag" style={{ width: '100px', height: '80px' }} /></a>
              </div>
            </div>
          })}
        </Carousel>
      </Card.Body>
    </Card>
  </div>

  const countriesWishList = <div id={'countriesWishList'}>

    <h4>Wish list:{isEditMode && <img src={penIcon} width='30px' onClick={showEditFieldModalHandler} />}</h4>
    <Card style={{ width: '45%' }}>
      <Card.Body>
        <Carousel show={3}>
          {userProfileData.countriesWishList.map((e, i) => {
            return <div key={i}>
              <div style={{ padding: 5 }}>
                <a href={`/countries/${e.value}`}><img src={e.flag} alt="country flag" style={{ width: '100%', height: '80%', objectFit: 'fill' }} /></a>
              </div>
            </div>
          })}
        </Carousel>
      </Card.Body>
    </Card>
  </div>



  const friends = <div id={'friends'}>
    <h3>Friends{isEditMode && <a href="/friends"><img src={penIcon} width='30px' /></a>}</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {userProfileData.friends.slice(0, 8).map((e, i) => {
        return <div key={i}>
          <Container>
            <a href={`/users/${e._id}`}>
<<<<<<< HEAD
              <Row><img src={e.profilePicture} alt={e.fullName} style={{ width: '100%', height: '80%', objectFit: 'fill' }}/></Row>
=======
              <Row><img src={e.profilePicture
                ? e.profilePicture
                : 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} alt={e.fullName} style={{ borderRadius: '100%', width: '80px', padding: 5 }} /></Row>
>>>>>>> development
              <Row className="justifyCenter"><small>{e.fullName}</small></Row>
            </a>
          </Container>
        </div>
      })}
    </div>
  </div>

  const comments = <div id={'comments'}>
    <Card className='profileCard'>
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
    </Card>
  </div>

  const images = <div>
    <Card className='profileCard'>
      <h2>{userProfileData.fullName}'s Images</h2>
      <FileUpload handleUpload={imageUploadHandler} />
      <div className={'photo-library-container'}>
        {userProfileData.images.map(image => {
          return <div key={image._id} className={'img photo-thumb'}>
            <img src={image.url} id={image._id} className={''} />
          </div>
        })}
      </div>
    </Card>
  </div>

  // Modal Body Logic

  let modalBody

  switch (selectedModal) {
    case 'about':
      modalBody = <Form controls={formControls} onSelectChange={formHandlers.handleSelectChange} config={{ fullName: userForm.fullName }} onSubmit={formHandlers.handleSubmit} onChange={formHandlers.handleChange} />
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
    <Notifications />
    <NavBar />
    <Container>
      {modal}

      <Container>
        <Row>
          <Col>{userInfo}</Col>
          <Col>
            <Card className='profileCard'>
              {friends}
            </Card>
          </Col>
        </Row>
      </Container>

      {general}
      {bio}

      {images}
      <Card className='profileCard'>
        {countriesVisited}
        {countriesWishList}
      </Card>


      {comments}

    </Container>

  </>

}

export default UserProfile