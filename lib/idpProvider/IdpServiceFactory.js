'use strict'

const IdpService = require('./IdpService')

// TODO how can I extract those type definitions?
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
 * @param {String} profile 
 * @param {ProviderConfig} config 
 */
module.exports.get = async (profile, config) => {
  /**
   * @type {IdpService}
   */
  let client

  switch (profile) {
    case 'openid':
      client = new (require('./GeneralOIDC'))(config)
      break;
    case 'gitlab':
      client = new (require('./GitLab'))(config)
      break;
    case 'gitlabapi-demo':
      client = new (require('./GitLabAPI'))(config)
      break;
    default:
      client = new (require('./GitLab'))(config)
      break;
  }

  return client
}
