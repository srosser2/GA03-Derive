import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Table, Jumbotron, Card } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth.js'

const Home = () => {

  const loggedIn = getLoggedInUserId()

  return <div className="center-me">
    <div className="home-middle">
      <h2 className={'homeH1'}>Dérive</h2>
      <p className={'homeP'}>Connect, Explore, Travel</p>
      {!loggedIn && <div className={'homeButtonContainer'}>
        <Link to={{ pathname: '/register' }}><Button Button className={'homeProfileButton'}>Register</Button></Link>
        <Link to={{ pathname: '/login' }}><Button Button className={'homeProfileButton'}>Login</Button></Link>
      </div>}
      {loggedIn && <Link className={'homeProfileButtonContainer'} to={{ pathname: `/users/${loggedIn.userId}` }}><Button className={'homeProfileButton'}>Profile</Button></Link>}
    </div>
  </div>
}

export default Home