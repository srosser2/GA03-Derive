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