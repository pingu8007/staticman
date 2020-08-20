'use strict'

const config = require('../../config')
const errorHandler = require('../ErrorHandler')
const IdpService = require('./IdpService')
const { Issuer, generators: { codeVerifier } } = require('openid-client')

// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GeneralOIDC extends IdpService {
  constructor(client_id, client_secret, discovery) {
    super()
    const metadata = {
      client_id,
      client_secret
    }

    return (async () => {
      const issuer = await Issuer.discover(discovery)
      this.client = new issuer.Client(metadata)

      return this
    })()
  }

  getAuthUrl(redirect_uri, response_type = 'code', scope = 'openid email profile') {
    return this.client.authorizationUrl({
      scope,
      response_type,
      redirect_uri
    })
  }

}

module.exports = GeneralOIDC
