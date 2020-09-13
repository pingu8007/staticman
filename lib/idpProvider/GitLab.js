'use strict'

const GeneralOIDC = require('./GeneralOIDC')

/**
 * This is an example identity provider based on GitLab OpenId Connect.
 * GitLab OIDC doesn't include user's bio and organization, those values will be constant.
 */
// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GitLab extends GeneralOIDC {
  constructor(client_id, client_secret, discovery = 'https://gitlab.com/.well-known/openid-configuration', mappings = []) {
    super(client_id, client_secret, discovery, mappings.concat(
      { type: 'path', field: 'username', value: 'nickname' },
      { type: 'path', field: 'avatarUrl', value: 'picture' },
      { type: 'path', field: 'siteUrl', value: 'website' },
      { type: 'static', field: 'bio', value: '' },
      { type: 'static', field: 'organisation', value: '' },
      { type: 'static', field: 'type', value: 'gitlab' }
    )).then(instance => {
      instance.ERROR_GET_CURRENT_USER = 'GET_GITLAB_USER_OIDC'
      return instance
    })
  }

}

module.exports = GitLab
