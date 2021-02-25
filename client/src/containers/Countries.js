import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, CardDeck, Card, Dropdown } from 'react-bootstrap'
import NavBar from '../components/Navbar'

import { getLoggedInUserId } from '../lib/auth'
import Form from '../components/Form.js'

const Countries = () => {

  const [search, updateSearch] = useState('')
  const [userData, updateUserData] = useState({})
  const [countries, updateCountries] = useState([])
  const [displayCountries, updateDisplayCountries] = useState([])
  const [searchText, updateSearchText] = useState({
    title: {
      placeholder: 'Search for countries',
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
      classes: ['searchButton']
    }
  }

  let searchResults
  if (displayCountries.length > 0) {
    searchResults = <CardDeck>

      {displayCountries.map((country, index) => {
        console.log(country._id, "country")
        return <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4} >
          <Card className={'country-card'}>
            <div>
              <Card.Img variant="top" src={country.flag} alt={country.name} className={'flag'} />
            </div>
            <Card.Body>
              <Card.Title className={'cardTitle'}>{country.name.length >= 20
                ? country.name.slice(0, 15) + '...'
                : country.name
              }</Card.Title>
              <Card.Text className={'cardText'}>{country.nativeName}</Card.Text>
              <div className={'countriesCardLinks'}>
                <Card.Link href={`/countries/${country._id}`}>View</Card.Link>
                <Card.Link href={`https://en.wikipedia.org/wiki/${country.name}`} target='_blank'>Wiki</Card.Link>
              </div>
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
    <NavBar />
    <Container>
      <Row>
        <Col>
          <h2 className={'countriesH2'}>Explore Countries</h2>
        </Col>
      </Row>

      <Row>
        <Col className={'countriesDropdownContainer'}>
          <Dropdown className={'countriesDropdown'}>
            <Dropdown.Toggle id="country-search-dropdown">Filter by region</Dropdown.Toggle>
            <Dropdown.Menu>
              {regions.map((region, index) => {
                return <Dropdown.Item key={index} onClick={() => handleClick(region)}>{region}</Dropdown.Item>
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row>
        <Col className={'countriesButtonsContainer'}>
          <button className={'countriesButton'} onClick={() => filterCountriesWishList()}>My wish list 🤞🏼</button>
          <button className={'countriesButton'} onClick={() => filterCountriesVisited()}>Countries visited ✅</button>
        </Col>
      </Row>

    </Container>

    <Container>
      <Col>
        <Form
          config={searchText}
          onChange={handleChange}
          controls={formControls}
          classes={['countriesForm']} />
      </Col>
    </Container>

    <Container>
      <Row>
        {searchResults}
      </Row>
    </Container>

  </>
}

export default Countries
