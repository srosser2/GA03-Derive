import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Container, Row, Col, CardDeck, Card, Dropdown } from 'react-bootstrap'

import { getLoggedInUserId } from '../lib/auth'
import Form from '../components/Form.js'

const Countries = () => {

  const [search, updateSearch] = useState('')
  const [userData, updateUserData] = useState({})
  const [countries, updateCountries] = useState([])
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
  const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  const currentUser = getLoggedInUserId()

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('/api/countries')
      updateCountries(data)
      updateDisplayCountries(data)

      axios.get('https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population')
        .then(function (html) {
          console.log(html)
        })
        .catch(function (err) {
          console.log(err)
        })

    }
    fetchData()
    async function fetchUser() {
      const { data } = await axios.get(`/api/users/${currentUser.userId}`)
      updateUserData(data)
    }
    fetchUser()
  }, [])

  function handleClick(region) {
    try {
      const filteredCountries = countries.filter(country => {
        return (region === 'All' || region === country.region)
      })
      updateDisplayCountries(filteredCountries)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...searchText }
    updatedForm[name].value = value
    updateSearchText(updatedForm)
  }

  const filterCountriesWishList = async () => {
    try {
      const countriesToVisit = userData.countriesWishList
      const countriesWL = countriesToVisit.map(country => {
        return country._id
      })
      const filteredCountries = await countries.filter(country => {
        return countriesWL.includes(country._id)
      })
      updateDisplayCountries(filteredCountries)
    } catch (err) {
      console.log(err)
    }
  }

  const filterCountriesVisited = async () => {
    try {
      const countriesVisited = userData.countriesVisited
      const myCountries = countriesVisited.map(country => {
        return country._id
      })
      const filteredCountries = await countries.filter(country => {
        return myCountries.includes(country._id)
      })
      updateDisplayCountries(filteredCountries)
    } catch (err) {
      console.log(err)
    }
  }

  const formControls = {
    submit: {
      handler: (e) => {
        const countryRequested = searchText.title.value
        const singleCountry = countries.filter(country => {
          return country.name.toLowerCase().startsWith(countryRequested.toLowerCase())
        })
        updateDisplayCountries(singleCountry)
        updateSearch(countryRequested)
      },
      label: 'Search',
      classes: ['hide']
    }
  }
  // const handleSubmit = () => {
  //   try {
  //     const countryRequested = searchText.title.value
  //     const singleCountry = countries.filter(country => {
  //       return country.name.toLowerCase().startsWith(countryRequested.toLowerCase())
  //     })
  //     updateDisplayCountries(singleCountry)
  //     updateSearch(countryRequested)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  let searchResults
  if (displayCountries.length > 0) {
    searchResults = <CardDeck>
      {displayCountries.map((country, index) => {
        return <Col key={index} xs={3}>
          <Card>
            <Card.Img variant="top" src={country.flag} alt={country.name} width={180} height={180} />
            <Card.Body>
              <Card.Title>{country.name}</Card.Title>
              <Card.Text>{country.nativeName}</Card.Text>
              <a href={`https://en.wikipedia.org/wiki/${country.name}`} target='_blank' >Wiki</a> 
              <Card.Link href={`/countries/${country._id}`}>View</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      })}
    </CardDeck>
  }

  if (search.length > 0 && displayCountries.length === 0) {
    searchResults = <div>
      <p>No results - please refine your search</p>
    </div>
  }

  return <>
    <Container>
      <Row>
        <h1>Explore Countries</h1>
      </Row>
      <Row>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="country-search-dropdown">Filter by region</Dropdown.Toggle>
          <Dropdown.Menu>
            {regions.map((region, index) => {
              return <Dropdown.Item key={index} onClick={() => handleClick(region)}>{region}</Dropdown.Item>
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Row>
      <Row>
        <Button onClick={() => filterCountriesWishList()}>See countries on my wish list</Button>
      </Row>
      <Row>
        <Button onClick={() => filterCountriesVisited()}>See countries visited</Button>
      </Row>

      <Row>
        <Form
          config={searchText}
          onChange={handleChange}
          // onSubmit={handleSubmit}
          controls={formControls} />
      </Row>
      <Row>
        {searchResults}
      </Row>
    </Container>
  </>
}

export default Countries
