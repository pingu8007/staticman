'use strict'

const config = require('../../config')
const errorHandler = require('../ErrorHandler')
const GitLabApi = require('gitlab/dist/es5').default
const IdpService = require('./IdpService')
const { Issuer, generators } = require('openid-client')
const Review = require('../models/Review')
const User = require('../models/User')
const GeneralOIDC = require('./GeneralOIDC')

const globalProvider = {}

// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GitLab extends GeneralOIDC {

  constructor(client_id, client_secret, discovery = 'https://gitlab.com/.well-known/openid-configuration') {
    super(client_id, client_secret, discovery)
  }

}

module.exports = GitLab
