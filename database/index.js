const bluebird = require('bluebird')
const mongoose = require('mongoose')
const { graphqlSchema, LocationTC } = require('./models')

mongoose.Promise = bluebird

module.exports = { mongoose, schema: graphqlSchema, LocationTC }
