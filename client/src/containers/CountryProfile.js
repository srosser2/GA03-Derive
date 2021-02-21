import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getLoggedInUserId } from '../lib/auth'

import { Container, Row, Col, Button } from 'react-bootstrap'
import Map from '../components/Map'
import Comment from '../components/Comment'
import Form from '../components/Form'

const CountryProfile = ({ match }) => {

  const countryId = match.params.id

  const [countryData, updateCountryData] = useState({})
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

  useEffect(() => {
    axios.get(`/api/countries/${countryId}`).then(({ data }) => {
      console.log(data)
      updateCountryData(data)
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

  const comments = countryData.comments ? 
    countryData.comments.map(comment => <Comment key={comment._id} data={comment} />)
    : null

  const toggleCommentForm = () => {
    updateShowCommentForm(!showCommentForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...commentForm }
    updatedForm[name].value = value
    updateCommentForm(updatedForm)
  }

  const handleSubmit = () => {
    const comment = {
      text: commentForm.text.value,
      user: getLoggedInUserId()
    }
    console.log(comment)
    axios.post(`api/countries/${match.params.id}/comments`, comment).then(( {data }) => console.log(data))
  }

  const commentFormElement = <Form config={commentForm} onChange={handleChange} onSubmit={handleSubmit} />

  return <Container>
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
    <Row>
      <Col>
        <h4>Comments ({countryData.comments ? comments.length : null})</h4>
        <Button onClick={toggleCommentForm}  variant="light">Add Comment</Button>
        {showCommentForm ? commentFormElement : null}
        {comments}
      </Col>
    </Row>
  </Container>
}
 
export default CountryProfile