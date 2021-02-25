import React, { useEffect, useState } from 'react'
import Form from '../components/Form.js'
import axios from 'axios'
import { Button, Card, CardDeck, Col, Container } from 'react-bootstrap'
import { getLoggedInUserId } from '../lib/auth.js'
import { Link } from 'react-router-dom'
import NavBar from '../components/Navbar'

const SearchProfiles = () => {

  const [allUsers, updateAllUsers] = useState([])
  const [displayUsers, updateDisplayUsers] = useState([])
  const [searchText, updateSearchText] = useState({
    title: {
      input: '',
      placeholder: 'Search by name: ',
      element: 'input',
      type: 'text',
      value: '',
      validation: {
        required: true
      }
    }
  })
  const [search, updateSearch] = useState('')

  const currentUserToken = getLoggedInUserId()
  const token = localStorage.getItem('token')

  async function fetchData() {
    const { data } = await axios.get('/api/users')
    const sortArray = data
    sortArray.sort(function (a, b) {
      return b.friends.includes(currentUserToken.userId) ? 1 : -1
    })
    updateAllUsers(sortArray)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...searchText }
    updatedForm[name].value = value
    updateSearchText(updatedForm)
  }

  const formControls = {
    submit: {
      handler: () => {
        try {
          const nameSearched = searchText.title.value
          const removeLoggedInUser = allUsers.filter(user => !user._id.includes(`${currentUserToken.userId}`))
          const matchingNames = removeLoggedInUser.filter(user => {
            return user.fullName.toLowerCase().startsWith(nameSearched.toLowerCase())
          })
          updateDisplayUsers(matchingNames)
          updateSearch(nameSearched)
        } catch (err) {
          console.log(err)
        }
      },
      label: 'Search',
      classes: ['searchButton']
    }
  }

  const addFriend = async (user) => {
    try {
      await axios.post(`/api/users/${user._id}/add`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(({ data }) => {
          const updatedDisplayUsers = [...displayUsers]
          const findUser = updatedDisplayUsers.find(user => user._id === data.Id)
          findUser.receivedRequests.push(currentUserToken.userId)
          updateDisplayUsers(updatedDisplayUsers)
        })
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  let searchResults




  if (displayUsers.length > 0) {

    searchResults = <CardDeck>
      {displayUsers.map((user, index) => {

        let friendStatus
        if (user.friends.includes(currentUserToken.userId)) {
          friendStatus = <p className={'cardText'}>Friends ✅</p>
        } else if (user.receivedRequests.includes(currentUserToken.userId) || user.sentRequests.includes(currentUserToken.userId)) {
          friendStatus = <p className={'cardText'}>Friend request sent</p>
        } else {
          friendStatus = <div className={'addFriendButtonContainer'}>
            <Button onClick={() => addFriend(user)}>Add Friend</Button>
          </div>
        }

        if (user._id !== currentUserToken.userId) {
          return <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4}>
            <Card className={'country-card'}>
              <div>
                <Card.Img variant="top" width={64} height={64} src={user.profilePicture
                  ? user.profilePicture
                  : 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'
                } alt="user image" className={'flag'} />
              </div>
              <Card.Body>
                <Card.Title>
                  <Link to={`/users/${user._id}`}>
                    <h4 className={'FriendsCardHeader'}>{user.fullName.length >= 15
                      ? user.fullName.slice(0, 15) + '...'
                      : user.fullName
                    }</h4>
                  </Link>
                </Card.Title>
                {friendStatus}
              </Card.Body>
            </Card>
          </Col>
        }
      })}
    </CardDeck>
  }

  if (search.length > 0 && displayUsers.length === 0) {
    searchResults = <div>
      <p>No results - please refine your search</p>
    </div>
  }

  return <>
    <NavBar />
    <Container>
      <h2 className={'countriesH2'}>Search Profiles</h2>
      <Form
        config={searchText}
        onChange={handleChange}
        controls={formControls}
        classes={['countriesForm']}
      />
      {searchResults}
    </Container>
  </>
}

export default SearchProfiles

