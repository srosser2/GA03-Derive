import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, CardDeck, Card } from 'react-bootstrap'

const SearchCountries = () => {

  const [countries, updateCountries] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('/api/countries')
      updateCountries(data)
      console.log(data[0])
    }
    fetchData()
  }, [])


  return <>
    <h1>Explore Countries</h1>
    <Container>
      <Row>
        <CardDeck>
          {countries.map((country, index) => {
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
