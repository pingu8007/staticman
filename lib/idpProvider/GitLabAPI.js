'use strict'

const errorHandler = require('../ErrorHandler')
const GeneralOIDC = require('./GeneralOIDC')

/**
 * This is an example identity provider based on GitLab API.
 * API call doesn't use auto-discovered endpoint so it won't work for custom instance.
 */
// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GitLabAPI extends GeneralOIDC {
  constructor(client_id, client_secret, discovery = 'https://gitlab.com/.well-known/openid-configuration', mappings = []) {
    super(client_id, client_secret, discovery, mappings.concat(
      { type: 'path', field: 'avatarUrl', value: 'avatar_url' },
      { type: 'path', field: 'siteUrl', value: 'website_url' },
      { type: 'path', field: 'organisation', value: 'organization' },
      { type: 'static', field: 'type', value: 'gitlab_api' }
    ))
  }

  /**
   * @param {string} redirect_uri The URL to go after user authorization success.
   * @param {string} scope Requested permission scopes.
   * @param {string} response_type OAuth response type. In most situations `code` is the value you need.
   */
  getAuthUrl(redirect_uri, scope = 'read_user', response_type = 'code') {
    return super.getAuthUrl(redirect_uri, scope, response_type)
  }

  /**
   * @param {string} redirect_uri The callback URL previously used to apply for authorization code.
   * @param {string} code The code returned after user authorization success.
   */
  async redeemCode(redirect_uri, code) {
    return await this.client.oauthCallback(redirect_uri, { code })
      .then(tokenSet => this.tokenSet = tokenSet)
      .catch(err => Promise.reject(errorHandler('GITLAB_AUTHORIZATION_CODE', { err })))
  }

  async _getUserinfo() {
    // TODO generate url from Gitlab instance baseUrl
    // is there any reliable base_url information available from discovered data?
    return await this.client.requestResource('https://gitlab.com/api/v4/user', this.tokenSet)
      .then(userinfo => JSON.parse(userinfo.body.toString('utf8')))
      // TODO handle unauthorized case
      .catch(err => Promise.reject(errorHandler('GITLAB_USERINFO', { err })))
  }

  async getCurrentUser() {
    return await this._getCurrentUser()
      .catch(err => Promise.reject(errorHandler('GET_GITLAB_USER_API', { err })))
  }

}

module.exports = GitLabAPI
