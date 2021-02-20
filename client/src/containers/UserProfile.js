import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Carousel from '../components/Carousel.js'
import UserProfileModal from '../components/UserProfileModal.js'

const UserProfile = () => {

  // get all the information
  const [user, updateUser] = useState([])
  const [editMode, updatEditMode] = useState(false)

  async function getUserData(){
    // hard coded in a user for now
    const { data } = await axios.get('/api/users/789f9be5b2113853ac6fd89a')
    console.log(data)
    updateUser(data)
    return data
  }

  async function putUserData(input){
    console.log(input, 'the data to put')
    const formData = {}
    try {
      // hard coded a token for now
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ODlmOWJlNWIyMTEzODUzYWM2ZmQ4OWEiLCJpYXQiOjE2MTM4MTI5NDcsImV4cCI6MTYxMzg1NjE0N30.t4vYfv0zxJg2ydvocENqJJnXh5r09BAg_feSvKuWDgI'
      // hard coded in a user for now
      const { data } = await axios.post('/api/users/789f9be5b2113853ac6fd89a', formData, { headers: {"Authorization" : `Bearer ${token}`} })
      console.log(data)
      updateUser(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    // get the token from localStorage
      // const token = localStorage.getItem('token')
    // get the id out of the token
      // const userId = JSON.parse(atob(token.split('.')[1])).userId
    getUserData()
  }, [])

  // FOR MORE PROGRAMMATIC FORM:
  // const body = config for the form
  // body={userd} 

  return <>
    <h1>User Profile</h1>
    {!editMode && <Button variant="primary" onClick={() => updatEditMode(!editMode)}>Edit Profile</Button>}
    {editMode && <Button variant="primary" onClick={() => updatEditMode(!editMode)}>Save Changes</Button>}

    <UserProfileModal editMode={editMode} user={user} info={['fullName', 'username']} putUserData={putUserData} />

    <div>{user.fullName}</div>
    <div>{user.username}</div>

    {user.isPublic && <>

      <div>
        <UserProfileModal editMode={editMode} user={user} info={['bio']} putUserData={putUserData} />
        Bio:
        <br />
        <div>&quot;{user.bio}&quot;</div> 
      </div>

      <div>
        <UserProfileModal editMode={editMode} user={user} info={['nationality', 'isTravelling', 'languages']} putUserData={putUserData} />
        <div>{user.nationality}</div>
        {user.isTravelling && <div>Currently Travelling: Yes</div>}
        {!user.isTravelling && <div>Currently Travelling: No</div>}
        <div>Lanuages Spoken: {user.languages.map((e, i) => {
          return <>
            <div key={i} style={{ display: 'inline-block' }}>{e} </div>
          </>
        })}</div>
      </div>

      <div>
        <UserProfileModal editMode={editMode} user={user} info={['countries']} putUserData={putUserData} />
        Countries Visited: 
        <br />
        <div style={{ width: '45%' }}>
          <Carousel show={3}>
            {['ThisWillBe: user.countriesVisited','random','countries','in','this','array','bla','blablabla'].map((e, i) => {
              return <div key={i}>
                <div style={{ padding: 5 }}>
                  <img src="https://picsum.photos/40/25/" alt="placeholder" style={{ width: '100%' }} />
                </div>
              </div>
            })}
          </Carousel>
        </div>
      </div>
      
      <div>
        <UserProfileModal editMode={editMode} user={user} info={['friends']} putUserData={putUserData} />
        Friends: 
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '50%', height: '200px' }}>
          {['ThisWillBe: user.friends','random','friends','in','this','array','bla','blablabla'].map((e, i) => {
            return <div key={i}>
              <img src="https://i.pravatar.cc/100" alt="placeholder" style={{ borderRadius: '100%', padding: 5 }} />
            </div>
          })}
        </div>
      </div>
      <br />

    </>}
  </>
}
 
export default UserProfile