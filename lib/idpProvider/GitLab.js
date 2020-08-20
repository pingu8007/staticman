'use strict'

const errorHandler = require('../ErrorHandler')
const User = require('../models/User')
const GeneralOIDC = require('./GeneralOIDC')

// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GitLab extends GeneralOIDC {

  constructor(client_id, client_secret, discovery = 'https://gitlab.com/.well-known/openid-configuration') {
    super(client_id, client_secret, discovery)
  }

  async getCurrentUser() {
    return await this._getUserinfo()
      .then(({ nickname, email, name, picture, website }) =>
        new User('gitlab', nickname, email, name, picture, '', website, '')
      )
      .catch(err => Promise.reject(errorHandler('GITLAB_GET_USER', { err })))
  }

}

module.exports = GitLab
