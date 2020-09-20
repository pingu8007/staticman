'use strict'

const path = require('object-path')
const User = require("../models/User")

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

class IdpService {

  /**
   * Generate URL of OIDC auth endpoint, with scope, callback and other parameters.
   * @param {string} redirect_uri The URL to go after user authorization success.
   * @param {string} scope Requested permission scopes.
   * @param {string} response_type OAuth response type. In most situations `code` is the value you need.
   * @returns {string} Target authorization redirect URI.
   */
  getAuthUrl(redirect_uri, scope = 'openid email profile', response_type = 'code') {
    throw new Error('Abstract method `getAuthEndpoint` should be implemented')
  }

  /**
   * Redeem access token with authorization code and keep in instance.
   * @param {string} redirect_uri The callback URL previously used to apply for authorization code.
   * @param {string} code The code returned after user authorization success.
   */
  redeemCode(redirect_uri, code) {
    throw new Error('Abstract method `redeemCode` should be implemented')
  }

  /**
   * Get User instance of currently authorized user.
   * @returns {User} Currently authorized user
   */
  getCurrentUser() {
    throw new Error('Abstract method `getCurrentUser` should be implemented')
  }

  /**
   * Create Mapper instance with rules
   * @param {Array.<RuleEntry>} rules Field mapping definitions
   */
  _mapField(rules) {
    /**
     * Search target field from given userinfo according to rules, or `defaultValue` if nothing matched.
     * @param {any} userinfo Responed userinfo data.
     * @param {String} fieldName The field to search.
     * @param {String} defaultValue Default value if field not found.
     */
    const mapper = (userinfo, fieldName, defaultValue = undefined) => {
      const mapping = rules.find(val => {
        if (fieldName !== val.field) return false
        if (val.type === 'static') return true
        return path.has(userinfo, val.value)
      })
      if (!mapping) return userinfo[fieldName] || defaultValue
      if (mapping.type === 'static') return mapping.value
      return path.get(userinfo, mapping.value)
    }
    return mapper;
  }

}

module.exports = IdpService
