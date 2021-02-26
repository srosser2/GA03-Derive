import React from 'react'
import { Container, Table, Card } from 'react-bootstrap'

import NavBar from '../components/Navbar'

const About = () => {

  const techInfo = [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png',
      alt: 'HTML5'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png',
      alt: 'CSS3'
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png',
      alt: 'JavaScript'
    },
    {
      url: 'https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png',
      alt: 'React'
    },
    {
      url: 'https://logodix.com/logo/1960631.png',
      alt: 'Mongo DB'
    },
    {
      url: 'https://i.pinimg.com/originals/69/e0/cd/69e0cd050ef9b12f2e2bc47af0afc6b6.png',
      alt: 'Mongoose'
    },
    {
      url: 'https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_960_720.png',
      alt: 'Node JS'
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTInyKv-rwtCwa_GmVdr1lOXu6PWPzTO1kMLpRLFuqIhDi4YBIGJgq8MmRQ9tvAj3YLh7M&usqp=CAU',
      alt: 'Mapbox'
    },
    {
      url: 'https://i.pinimg.com/originals/c1/78/5d/c1785d50a929254419fa4aad0560b058.png',
      alt: 'Bootstrap React'
    }
   
  ]

  const tech = techInfo.map(t => {
    return <div className={'tech-card'} key={t.alt}>
      <img src={t.url}  />
    </div>
  })

  return <>
    <NavBar />
    <Container>

      <Card className="profileCard">
        <h2 className={'countriesH2'}>About</h2>
        <p>
          Dérive brings together like-minded individuals who have a passion for travelling and provides a space to explore countries, connect with others and share experiences.
        </p>
      </Card>

      <Card className="profileCard">
        <h3 className={'countriesH2'}>Created by</h3>
        <p>
          <a href="https://github.com/hannahakhtar">Hannah Akhtar</a>, <a href="https://github.com/srosser2">Sam Rosser</a> and <a href="https://github.com/steftones">Stefan Sokolowski</a> as part of Project 3 for <a href="https://generalassemb.ly/">General Assembly’s</a> Software Engineering Immersive course.
        </p>
      </Card>
      
      <Card className="profileCard">
        <h4 className={'countriesH2'}>Technologies</h4>

        <div className={'tech-list-container'}>
          {tech}
        </div>

      </Card>
    </Container>
  </>
}

export default About