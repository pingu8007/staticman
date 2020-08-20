'use strict'

class IdpService {

  getAuthUrl(redirect_uri, response_type = 'code', scope = 'openid email profile') {
    throw new Error('Abstract method `getAuthEndpoint` should be implemented')
  }

  redeemCode(uri) {
    throw new Error('Abstract method `redeemCode` should be implemented')
  }

  getCurrentUser() {
    throw new Error('Abstract method `getCurrentUser` should be implemented')
  }

}

module.exports = IdpService
