import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, CardDeck, Card, Dropdown } from 'react-bootstrap'

import Form from '../components/Form.js'

const SearchCountries = () => {

  const [countries, updateCountries] = useState([])
  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  const [displayCountries, updateDisplayCountries] = useState([])
  const [searchText, updateSearchText] = useState({
    title: {
      label: '',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    }
  })

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('/api/countries')
      updateCountries(data)
      updateDisplayCountries(data)
    }
    fetchData()
  }, [])

  function handleClick(region) {
    const filteredCountries = countries.filter(country => {
      return (region === 'All' || region === country.region)
      // && country.name.toLowerCase().includes(search.toLowerCase()
    })
    updateDisplayCountries(filteredCountries)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...searchText }
    updatedForm[name].value = value
    updateSearchText(updatedForm)
  }

  const handleSubmit = () => {
    const countryRequested = searchText.title.value
    const singleCountry = countries.filter(country => {
      return country.name.toLowerCase().includes(countryRequested.toLowerCase())
    })
    updateDisplayCountries(singleCountry)
  }

  return <>
    <h1>Explore Countries</h1>
    <Container>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="country-search-dropdown">Filter by region</Dropdown.Toggle>
        <Dropdown.Menu>
          {regions.map((region, index) => {
            return <Dropdown.Item key={index} onClick={() => handleClick(region)}>{region}</Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Form config={searchText} onChange={handleChange} onSubmit={handleSubmit} />
    </Container>
    <Container>
      <Row>
        <CardDeck>
          {displayCountries.map((country, index) => {
            return <Col key={index} xs={3}>
              <Card>
                <Card.Img variant="top" src={country.flag} alt={country.name} width={180} height={180} />
                <Card.Body>
                  <Card.Title>{country.name}</Card.Title>
                  <Card.Text>{country.nativeName}</Card.Text>
                  <Card.Link href={`/country/${country._id}`}>View</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          })}
        </CardDeck>
      </Row>
    </Container>
  </>
}

export default SearchCountries
