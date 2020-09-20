'use strict'

const GeneralOIDC = require('./GeneralOIDC')

/**
 * @typedef RuleEntry
 * @property {'static'|'path'} type How this rule take effect. `static` for constant, `path` for path search.
 * @property {string} field Which field this rule used for.
 * @property {string} value The constant to fill, or the path of value.
 */
/**
 * @typedef ProviderConfig
 * @property {String} clientId Client Id assigned by OAuth provider
 * @property {String} clientSecret Encrypted client secret assigned by OAuth provider
 * @property {String} discovery
 * @property {Array.<RuleEntry>} mappings
 */

/**
 * This is an example identity provider based on GitLab OpenId Connect.
 * GitLab OIDC doesn't include user's bio and organization, those values will be constant.
 */
// https://github.com/panva/node-openid-client/blob/master/docs/README.md
class GitLab extends GeneralOIDC {
  /**
   * @param {ProviderConfig} config 
   */
  constructor(config) {
    super(config)
    if (!!config.discovery)
      this.config.discovery = "https://gitlab.com/.well-known/openid-configuration"
    this.vendorMappings.unshift(
      { type: 'path', field: 'username', value: 'nickname' },
      { type: 'path', field: 'avatarUrl', value: 'picture' },
      { type: 'path', field: 'siteUrl', value: 'website' },
      { type: 'static', field: 'bio', value: '' },
      { type: 'static', field: 'organisation', value: '' },
      { type: 'static', field: 'type', value: 'gitlab' }
    )

    this.ERROR_GET_CURRENT_USER = 'GET_GITLAB_USER_OIDC'
  }

}

module.exports = GitLab
