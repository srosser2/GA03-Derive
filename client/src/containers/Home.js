import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Home = () => {
  return <>
    <h1>Title</h1>
    <p>Subtitle</p>
    <div>
      <Link
        to={{
          pathname: '/register'
        }}>
        <Button variant="primary">Register</Button></Link>
      <Link
        to={{
          pathname: '/login'
        }}><Button variant="warning">Login</Button></Link>
    </div>
  </>
}

export default Home