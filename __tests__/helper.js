// The helper file gets run before any tests

import chai from 'chai'
// Global creates global variable in Node
global.expect = chai.expect

// Supertest - a wrapper 
import supertest from 'supertest'

import expressApp from '../index.js'

global.api = supertest(expressApp)