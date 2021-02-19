/* eslint-disable no-undef */
import setup from './lib/setup.js'
import tearDown from './lib/tearDown.js'

import { expect } from 'chai'

describe('User endpoints tests', () => {
  beforeEach(done => {
    setup(done)
  })

  afterEach(done => {
    tearDown(done)
  })


  it('Should be able to register a user', done => {
    api.post('/api/register')
      .send({
        fullName: 'Joe Bloggs',
        username: 'joeb',
        email: 'joeb@joeb.com',
        password: 'joeb1234',
        passwordConfirmation: 'joeb1234',
        bio: '',
        nationality: '',
        countriesVisited: [],
        countriesWishList: [],
        isTravelling: false,
        isPublic: false,
        friends: [],
        sentRequests: [],
        receivedRequests: [],
        languages: []
      })
      .end((err, res) => {
        expect(res.status).to.equal(201)
        done()
      })
  })

  it('Should fail to register a user where password doesn\'t match', done => {
    api.post('/api/register')
      .send({
        fullName: 'Joe Bloggs',
        username: 'joeb',
        email: 'joeb@joeb.com',
        password: 'joeb1234',
        passwordConfirmation: 'joeb4321',
        bio: '',
        nationality: '',
        countriesVisited: [],
        countriesWishList: [],
        isTravelling: false,
        isPublic: false,
        friends: [],
        sentRequests: [],
        receivedRequests: [],
        languages: []
      })
      .end((err, res) => {
        expect(res.status).to.equal(422)
        // console.log(res.status)
        done()
      })
  })
  it('Should be able to login a user', done => {
    api.post('/api/login')
      .send({
        email: 'samr@samr.com',
        password: 'samr1234'
      })
      .end((err, res) => {
        expect(res.body).to.have.property('token')
        done()
      })
  })

  
})