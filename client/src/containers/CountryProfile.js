import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from '../components/Navbar'

import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import Map from '../components/Map'
import Comment from '../components/Comment'
import Form from '../components/Form'
import Modal from '../components/Modal'

const CountryProfile = ({ match, history }) => {

  const countryId = match.params.id
  const token = localStorage.getItem('token')

  const [countryData, updateCountryData] = useState({})
  const [commentData, updateCommentData] = useState([])
  const [showModal, updateShowModal] = useState(false)
  const [showCommentForm, updateShowCommentForm] = useState(false)
  const [commentForm, updateCommentForm] = useState({
    text: {
      label: 'Comment',
      element: 'textarea',
      type: 'text',
      value: '',
      validation: {
      }
    }
  })
  const [editCommentForm, updateEditCommentForm] = useState({
    text: {
      label: 'Comment',
      element: 'textarea',
      type: 'text',
      value: '',
      validation: {
      }
    }
  })
  const [editCommentId, updateEditCommentId] = useState()

  useEffect(() => {
    axios.get(`/api/countries/${countryId}`).then(({ data }) => {
      updateCountryData(data)
      updateCommentData(data.comments)
    })
  }, [])

  const map = countryData.latlng ?
    <Map
      latitude={countryData.latlng[0]}
      longitude={countryData.latlng[1]}
      zoom={5}
      width={'100%'}
      height={'400px'}
    />
    : null

  const getCommentId = e => {
    let commentContainer = e.target
    while (!commentContainer.hasAttribute('id')) {
      commentContainer = commentContainer.parentElement
    }
    return commentContainer.getAttribute('id')
  }

  const handleCommentDelete = e => {
    const commentId = getCommentId(e)
    axios.delete(`/api/countries/${countryData._id}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(({ data }) => {
      const updatedCommentData = commentData.filter(comment => comment._id !== data.id)
      updateCommentData(updatedCommentData)
    })
  }

  const handleEditCommentModal = e => {
    let commentContainer = e.target
    while (!commentContainer.hasAttribute('id')) {
      commentContainer = commentContainer.parentElement
    }
    const commentId = commentContainer.getAttribute('id')
    const findComment = commentData.find(comment => comment._id === commentId)
    const updatedEditCommentForm = { ...editCommentForm }
    updatedEditCommentForm.text.value = findComment.text
    updateEditCommentForm(updatedEditCommentForm)
    updateEditCommentId(commentId)
    updateShowModal(true)
  }

  const closeModal = () => updateShowModal(false)

  const toggleCommentForm = () => {
    updateShowCommentForm(!showCommentForm)
  }

  const handleChange = (e, form, updateFormCb) => {
    const { name, value } = e.target
    const updatedForm = { ...form }
    updatedForm[name].value = value
    updateFormCb(updatedForm)
  }

  const postCommmentControls = {
    submit: {
      handler: () => {
        const comment = {
          text: commentForm.text.value
        }
        axios.post(`/api/countries/${match.params.id}/comments`, comment, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(({ data }) => {
          const updatedCommentData = ([...commentData])
          updatedCommentData.push(data)
          updateCommentData(updatedCommentData)
          const updatedCommentForm = { ...commentForm }
          commentForm.text.value = ''
          updateCommentForm(updatedCommentForm)
        }).catch(err => console.log(err))
      },
      label: 'Post Comment',
      classes: ['btn', 'btn-primary']
    }
  }

  const modalCommentFormControls = {
    submit: {
      handler: () => {
        const comment = {
          text: editCommentForm.text.value
        }
        axios.put(`/api/countries/${countryId}/comments/${editCommentId}`, comment, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(({ data }) => {
          const updatedCommentData = [...commentData]
          const commentToUpdate = updatedCommentData.find(comment => comment._id === data._id)
          commentToUpdate.text = data.text
          console.log(updatedCommentData)
          updateCommentData(updatedCommentData)
          updateShowModal(false)
        })
      },
      label: 'Post Comment',
      classes: ['btn', 'btn-primary']
    }
  }


  const likeCommentHandler = e => {
    const commentId = getCommentId(e)
    axios.post(`/api/comments/${commentId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(({ data }) => {
      const updatedCommentData = [...commentData]
      const commentToUpdate = updatedCommentData.find(comment => comment._id === data._id)
      commentToUpdate.likes = data.likes
      updateCommentData(updatedCommentData)
    })
  }

  const comments = commentData
    .sort((a, b) => a.createdAt < b.updatedAt ? 1 : -1)
    .map(comment => <Comment
      key={comment._id}
      data={comment}
      deleteHandler={handleCommentDelete}
      editHandler={handleEditCommentModal}
      likeHandler={likeCommentHandler}
      viewProfileHandler={(userId) => history.push(`/users/${userId}`)} />)

  const commentFormElement = <Form
    config={commentForm}
    controls={postCommmentControls}
    onChange={e => handleChange(e, commentForm, updateCommentForm)}
  />

  const modalFormBody = <Form
    config={editCommentForm}
    onChange={e => handleChange(e, editCommentForm, updateEditCommentForm)}
    controls={modalCommentFormControls}
  />

  return <>
    <NavBar />
    <Container>
      <Modal show={showModal} hideModalHandler={closeModal} body={modalFormBody} />
      <Card className='profileCard'>
        <Row>
          <Col>
            <h1>{countryData.name}</h1>
            <h2>Native Name: {countryData.nativeName}</h2>
            <h4>Population: {countryData.population}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            {map}
          </Col>
        </Row>
      </Card>
      <Row>
        <Card className='profileCard'>
          <Col md={{ span: 8, offset: 2 }}>
            <h4>Comments ({countryData.comments ? comments.length : null})</h4>
            <Button onClick={toggleCommentForm} variant="light">Add Comment</Button>
            {showCommentForm ? commentFormElement : null}
            {comments}
          </Col>
        </Card>
      </Row>
    </Container>
  </>
}

export default CountryProfile