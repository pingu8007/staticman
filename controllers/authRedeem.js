'use strict'

const config = require('../config')
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
    .then(async client => {
      const redirectUrl = [
        config.get('baseUrl').replace(/\/$/, ''),
        `v${req.params.version}`,
        'auth',
        'cb',
        req.params.service,
        req.params.username,
        req.params.repository,
        req.params.branch,
        req.params.property,
        req.params.idp
      ].join('/')

      await client.redeemCode(redirectUrl, req.query.code)
      const user = await client.getCurrentUser()
      const encryptedText = RSA.encrypt(JSON.stringify(user))
      if (!encryptedText) {
        return res.status(500).send('Could not encrypt text')
      }
      return res.send(encryptedText)
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
