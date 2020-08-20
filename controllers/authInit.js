'use strict'

const config = require('../config')
const gitFactory = require('../lib/GitServiceFactory')
const oauth = require('../lib/OAuth')
const RSA = require('../lib/RSA')
const Staticman = require('../lib/Staticman')
const GitLab = require('../lib/idpProvider/GitLab')

module.exports = async (req, res) => {
  const staticman = await new Staticman(req.params)
  staticman.setConfigPath()

  return staticman.getSiteConfig()
    .then(async (siteConfig) => {
      // TODO fallback to global profile if exists
      const {
        clientId,
        clientSecret,
        discovery
      } = siteConfig.get('auth.providers').find(val => val.name == req.params.idp) || {}

      // TODO use factory class to create handler
      return new GitLab(
        clientId,
        RSA.decrypt(clientSecret),
        discovery
      )
    })
    .then(async (oidcClient) => {
      // TODO derive redirectUrl from current req.params/req.baseUrl
      return res.redirect(oidcClient.getAuthUrl(config.get('baseUrl') + req.baseUrl))
    })
    .catch((err) => {
      console.log('ERR:', err)

      const statusCode = err.statusCode || 401

      res.status(statusCode).send({
        statusCode,
        message: err.message
      })
    })
}
