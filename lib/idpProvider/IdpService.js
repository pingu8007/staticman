'use strict'

const errorHandler = require('../ErrorHandler')
const yaml = require('js-yaml')

class IdpService {

  getAuthUrl (redirect_uri, response_type = 'code', scope = 'openid email profile') {
    throw new Error('Abstract method `getAuthEndpoint` should be implemented')
  }

}

module.exports = IdpService
