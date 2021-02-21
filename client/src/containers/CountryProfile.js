import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Container, Row, Col } from 'react-bootstrap'
import Map from '../components/Map'

const CountryProfile = ({ match }) => {

  const countryId = match.params.id

  const [countryData, updateCountryData] = useState({})

  useEffect(() => {
    axios.get(`/api/countries/${countryId}`).then(({ data }) => {
      updateCountryData(data)
    })
  }, [])

  const map = countryData.latlng ? <Map 
  latitude={countryData.latlng[0]} 
  longitude={countryData.latlng[1]} 
  zoom={5}
  width={'100%'}
  height={'400px'}
  /> : null


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
  </Container>
}
 
export default CountryProfile