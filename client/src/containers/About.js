import React from 'react'
import { Container, Table, Card } from 'react-bootstrap'

import NavBar from '../components/Navbar'

const About = () => {

  console.log('%cHello!', 'color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;', '\nAre you reading? We\'re hiring!\n\nGet in contact today...\n\n')

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
        <Table borderless={true}>
          <thead>
            <tr>
              <th align="center"><img width="100px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png" alt="HTML5" /></th>
              <th align="center"><img width="100px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png" alt="CSS" /></th>
              <th align="center"><img width="100px" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="Javascript" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th align="center"><img width="100px" src="https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png" alt="React" /></th>
              <th align="center"><img width="100px" src="https://logodix.com/logo/1960631.png" alt="Mongo DB" /></th>
              <th align="center"><img width="100px" src="https://i.pinimg.com/originals/69/e0/cd/69e0cd050ef9b12f2e2bc47af0afc6b6.png" alt="Mongoose" /></th>
            </tr>
            <tr>
              <th align="center"><img width="100px" src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_960_720.png" alt="Node JS" /></th>
              <th align="center"><img width="100px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTInyKv-rwtCwa_GmVdr1lOXu6PWPzTO1kMLpRLFuqIhDi4YBIGJgq8MmRQ9tvAj3YLh7M&usqp=CAU" alt="Mapbox" /></th>
              <th align="center"><img width="100px" src="https://i.pinimg.com/originals/c1/78/5d/c1785d50a929254419fa4aad0560b058.png" alt="React Bootstrap" /></th>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  </>
}

export default About