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

  it('Should be able to post a comment as logged in user', done => {
    api.post('/api/login')
      .send({
        email: 'samr@samr.com',
        password: 'samr1234'
      })
      .end((err, res) => {
        expect(res.body).to.have.property('token')
        const token = res.body.token
        api.get('/api/countries')
          .end((err, res) => {
            expect(res.body).to.be.an('array')
            expect(res.body[0].name).to.equal('Afghanistan')
            api.post(`/api/countries/${res.body[0]._id}/comments`)
              .set('Authorization', `Bearer ${token}`)
              .send({
                text: 'this is a test comment'
              })
              .end((err, res) => {
                expect(res.body.text).to.equal('this is a test comment')
                done()
              })
          })
      })
  })

  
})