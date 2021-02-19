// The helper file gets run before any tests

process.env.NODE_ENV = 'test'

import chai from 'chai'
// Global creates global variable in Node
global.expect = chai.expect

// Supertest - a wrapper 
import supertest from 'supertest'

import expressApp from '../index.js'

global.api = supertest(expressApp)