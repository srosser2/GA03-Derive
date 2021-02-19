import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return <>
    <h1>Title</h1>
    <p>Subtitle</p>
    <div>
      <Link
        to={{
          pathname: '/register'
        }}>
        <button>Register</button></Link>
      <Link
        to={{
          pathname: '/login'
        }}><button>Login</button></Link>
    </div>
  </>
}

export default Home