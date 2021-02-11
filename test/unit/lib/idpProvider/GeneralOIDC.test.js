const nock = require('nock')
const GeneralOIDC = require('../../../../lib/idpProvider/GeneralOIDC')

// https://jwt.io
const tokenData = {
  "iss": "http://dummy",
  "sub": "CUSTOM_SUB",
  "aud": "OAUTH_CLIENT_ID",
  "exp": 4102444800,
  "iat": 1601510400,
  "auth_time": 1601510400,
  "email": "test@dummy",
  "email_verified": true
}
const tokenReq = {
  "code": "CODE",
  "grant_type": "authorization_code",
  "redirect_uri": "http://app.dummy/callback"
}
const tokenRes = {
  "access_token": "DUMMY_ACCESS_TOKEN",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRVTU1ZX0tFWV9JRCJ9.eyJpc3MiOiJodHRwOi8vZHVtbXkiLCJzdWIiOiJDVVNUT01fU1VCIiwiYXVkIjoiT0FVVEhfQ0xJRU5UX0lEIiwiZXhwIjo0MTAyNDQ0ODAwLCJpYXQiOjE2MDE1MTA0MDAsImF1dGhfdGltZSI6MTYwMTUxMDQwMCwiZW1haWwiOiJ0ZXN0QGR1bW15IiwiZW1haWxfdmVyaWZpZWQiOnRydWV9.Bo-eB6RsAk7dAicHL0lW3hULv8t9RjCSTJ3PPaoZICdOdyUyFmHg_hice0_wbovb5Pxsbs6Vkw7PLp7jlCgrBA",
  "created_at": tokenData.auth_time,
  "token_type": "Bearer",
  "scope": "openid email profile",
  "refresh_token": "DUMMY_REFRESH_TOKEN"
}
// https://russelldavies.github.io/jwk-creator/
const jwksRes = {
  "keys": [
    {
      "kty": "RSA",
      "n": "tvc_L4dLDFR_sRsyC_ZRJT2dPuRPIrGlF81bVmlkcE6YCusis8x-vK23fMQSEbIFAicLCsxw5mHy_zhgzNYGEw",
      "e": "AQAB",
      "alg": "RS256",
      "kid": "DUMMY_KEY_ID",
      "use": "sig"
    }
  ]
}

const authCB = tokenReq.redirect_uri
const baseUrl = tokenData.iss

describe('Test GenerialOIDC', () => {

  const config = {
    clientId: tokenData.aud,
    clientSecret: 'ABCDEF',
    discovery: baseUrl + '/.well-known/openid-configuration'
  }
  const client = new GeneralOIDC(config)

  test('is constructed correctly', async () => {
    expect(client.config).toEqual(config)
    expect(client.userMappings).toHaveLength(0)
    expect(client.vendorMappings).toHaveLength(0)
    expect(client.ERROR_GET_CURRENT_USER).toEqual('GET_USER_OIDC')
    expect(client.client).toBeUndefined()
  })

  test('is initialized correctly', async () => {
    const scope = nock(baseUrl)
      .get('/.well-known/openid-configuration')
      .reply(200, {
        "issuer": baseUrl,
        "authorization_endpoint": baseUrl + "/oauth/authorize",
        "token_endpoint": baseUrl + "/oauth/token",
        "userinfo_endpoint": baseUrl + "/oauth/userinfo",
        "jwks_uri": baseUrl + "/oauth/discovery/keys",
        "scopes_supported": ["read_user", "openid", "profile", "email"],
        "response_types_supported": ["code", "token"],
        "grant_types_supported": ["authorization_code"]
      })
    await expect(client.init()).resolves.not.toThrow()
    expect(client.client).not.toBeUndefined()
    expect(client.userMappings).toHaveLength(0)
    expect(scope.isDone()).toBe(true)
    nock.cleanAll()
  })

  test('can generate redirectUrl in default scope', async () => {
    const authScope = 'openid email profile'
    const authType = 'code'
    const redirectUrl = client.getAuthUrl(authCB)
    expect(redirectUrl).toContain('client_id=' + encodeURIComponent(config.clientId))
    expect(redirectUrl).toContain('redirect_uri=' + encodeURIComponent(authCB))
    expect(redirectUrl).toContain('response_type=' + encodeURIComponent(authType))
    expect(redirectUrl).toContain('scope=' + encodeURIComponent(authScope))
  })

  test('can generate redirectUrl in custom scope', async () => {
    const authScope = 'read_user openid profile email'
    const authType = 'token'
    const redirectUrl = client.getAuthUrl(authCB, authScope, authType)
    expect(redirectUrl).toContain('client_id=' + encodeURIComponent(config.clientId))
    expect(redirectUrl).toContain('redirect_uri=' + encodeURIComponent(authCB))
    expect(redirectUrl).toContain('response_type=' + encodeURIComponent(authType))
    expect(redirectUrl).toContain('scope=' + encodeURIComponent(authScope))
  })

  test('can redeem authorization_code', async () => {
    const scope = nock(baseUrl)
      .post('/oauth/token', tokenReq)
      .reply(200, tokenRes)
      .get('/oauth/discovery/keys')
      .reply(200, jwksRes)

    const token = await client.redeemCode(authCB, tokenReq.code)
    expect(scope.isDone()).toBe(true)
    expect(token.access_token).toBe(tokenRes.access_token)
    expect(token.refresh_token).toBe(tokenRes.refresh_token)
    nock.cleanAll()
  })

  test('can get userinfo', async () => {
    const userRes = {
      "sub": tokenData.sub,
      "username": "RANDOM_USERNAME",
      "email": "no-reply@example.localhost",
      "name": "RANDOM_USER"
    }
    const scope = nock(baseUrl)
      .matchHeader('authorization', `Bearer ${tokenRes.access_token}`)
      .get('/oauth/userinfo')
      .reply(200, userRes)

    const user = await client.getCurrentUser()
    expect(scope.isDone()).toBe(true)
    expect(user.name).toBe(userRes.name)
    expect(user.email).toBe(userRes.email)
    expect(user.username).toBe(userRes.username)
    nock.cleanAll()
  })

})
