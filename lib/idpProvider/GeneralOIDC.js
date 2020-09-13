'use strict'

const errorHandler = require('../ErrorHandler')
const User = require('../models/User')
const IdpService = require('./IdpService')
const { Issuer } = require('openid-client')

/**
 * A General OpenId Connect client.
 */
// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GeneralOIDC extends IdpService {
  constructor(client_id, client_secret, discovery, mappings) {
    super()
    const metadata = {
      client_id,
      client_secret
    }

    return (async () => {
      const issuer = await Issuer.discover(discovery)
      this.client = new issuer.Client(metadata)
      this.mappings = mappings

      return this
    })()
  }

  /**
   * @param {string} redirect_uri The URL to go after user authorization success.
   * @param {string} scope Requested permission scopes.
   * @param {string} response_type OAuth response type. In most situations `code` is the value you need.
   */
  getAuthUrl(redirect_uri, scope = 'openid email profile', response_type = 'code') {
    return this.client.authorizationUrl({
      scope,
      response_type,
      redirect_uri
    })
  }

  /**
   * @param {string} redirect_uri The callback URL previously used to apply for authorization code.
   * @param {string} code The code returned after user authorization success.
   */
  async redeemCode(redirect_uri, code) {
    return await this.client.callback(redirect_uri, { code })
      .then(tokenSet => this.tokenSet = tokenSet)
      .catch(err => Promise.reject(errorHandler('OIDC_AUTHORIZATION_CODE', { err })))
  }

  /**
   * Calling userinfo endpoint and return acquired data.
   */
  async _getUserinfo() {
    return await this.client.userinfo(this.tokenSet)
      .catch(err => Promise.reject(errorHandler('OIDC_USERINFO', { err })))
  }

  /**
   * Get User instance of currently authorized user.
   * This is an internal function without exception handling.
   */
  async _getCurrentUser() {
    const mapField = this._mapField(this.mappings)
    const data = await this._getUserinfo()
    return new User(
      mapField(data, 'type', 'oidc'),
      mapField(data, 'username'),
      mapField(data, 'email'),
      mapField(data, 'name'),
      mapField(data, 'avatarUrl'),
      mapField(data, 'bio'),
      mapField(data, 'siteUrl'),
      mapField(data, 'organisation')
    )
  }

  async getCurrentUser() {
    return await this._getCurrentUser()
      .catch(err => Promise.reject(errorHandler('GET_USER_OIDC', { err })))
  }

}

module.exports = GeneralOIDC
