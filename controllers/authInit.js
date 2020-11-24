'use strict'

const config = require('../config')
const RSA = require('../lib/RSA')
const Staticman = require('../lib/Staticman')
const factory = require('../lib/idpProvider/IdpServiceFactory')

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

      // GeneralOIDC should throw error if mappings is undefined
      return factory.get(req.params.idp, {
        clientId,
        clientSecret: RSA.decrypt(clientSecret),
        discovery,
        mappings
      }).then(async client => {
        const redirectUrl = config.get('baseUrl').replace(/\/$/, '') + req.path

        if (!req.query.code) {
          return res.redirect(client.getAuthUrl(redirectUrl))
        }

        await client.redeemCode(redirectUrl, req.query.code)
        const user = await client.getCurrentUser()
        const encryptedText = RSA.encrypt(JSON.stringify(user))
        let resData = {
          "success": !!encryptedText
        }
        if (!resData.success) {
          resData.message = 'Could not encrypt text'
        } else {
          resData.data = encryptedText
        }

        switch (siteConfig.get('auth.responseMethod')) {
          case 'postMessage':
            resData.raw = JSON.stringify(resData)

            let target = siteConfig.get('auth.responseTarget')
            if (!!target) resData.target = target

            if (!resData.success) return res.status(500).render('postAuthorize', resData)
            return res.render('postAuthorize', resData)

          case 'json':
            if (!resData.success) return res.status(500).json(resData)
            return res.json(resData)

          case 'jsonp':
            if (!resData.success) return res.status(500).jsonp(resData)
            return res.jsonp(resData)

          case 'plain':
          default:
            if (!resData.success) return res.status(500).send(resData.message)
            return res.send(resData.data)
        }
      })
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
