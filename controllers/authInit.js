'use strict'

const config = require('../config')
const RSA = require('../lib/RSA')
const Staticman = require('../lib/Staticman')
const Client = require('../lib/idpProvider/GitLab')

module.exports = async (req, res) => {
  const staticman = await new Staticman(req.params)
  staticman.setConfigPath()

  return staticman.getSiteConfig()
    .then(async (siteConfig) => {
      // TODO fallback to global profile if exists
      const {
        clientId,
        clientSecret,
        discovery,
        mappings
      } = siteConfig.get('auth.providers').find(val => val.name == req.params.idp) || {}

      // TODO use factory class to create handler
      // GeneralOIDC should throw error if mappings is undefined
      return new Client(
        clientId,
        RSA.decrypt(clientSecret),
        discovery,
        mappings
      )
    })
    .then(async client => {
      const redirectUrl = config.get('baseUrl').replace(/\/$/, '') + req.path

      if (!req.query.code) {
        return res.redirect(client.getAuthUrl(redirectUrl))
      }

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
