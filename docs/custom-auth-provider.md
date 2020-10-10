# Custom Identity Provider

Staticman support custom identity provider, site owners can define which provider to integrate with in their siteConfig.

## Some OpenId Connect provider you may interest

### [GitLab](https://docs.gitlab.com/ee/integration/openid_connect_provider.html)

GitLab provide auto-discoverable OIDC setup, check document below.

- Doc: <https://docs.gitlab.com/ee/integration/openid_connect_provider.html>
- Path: <https://gitlab.com/.well-known/openid-configuration>

A userinfo response may looks like:

```json
{
  "website": "USER_WEBSITE",
  "profile": "GITLAB_PROFILE",
  "sub": "GITLAB_USER_ID",
  "picture": "USER_AVATAR",
  "email_verified": true,
  "groups": [
    "GROUP_A",
    "GROUP_B"
  ],
  "sub_legacy": "GITLAB_USER_ID_LEGACY",
  "nickname": "GITLAB_USERNAME",
  "email": "USER_EMAIL",
  "name": "USER_DISPLAY_NAME"
}
```

Unlike OAuth-based implementation, `bio` and `organisation` are not accessable in OIDC.

### [Google](https://developers.google.com/identity/protocols/oauth2/openid-connect)

Google also provide auto-discoverable OIDC setup, check document below.

- Doc: <https://developers.google.com/identity/protocols/oauth2/openid-connect>
- Path: <https://accounts.google.com/.well-known/openid-configuration>

The userinfo response looks like:

```json
{
  "family_name": "USER_FAMILY_NAME",
  "sub": "GOOGLE_USER_ID",
  "picture": "USER_AVATAR",
  "locale": "USER_LOCALE",
  "email_verified": true,
  "given_name": "USER_GIVEN_NAME",
  "email": "USER_EMAIL",
  "name": "USER_DISPLAY_NAME"
}
```

Google doesn't provide one's `username` in any aspect. If it's important to you, consider other providers.

There are no `siteUrl`, `bio` nor `organisation`, either.

### [Microsoft](https://docs.microsoft.com/zh-tw/azure/active-directory/develop/v2-protocols-oidc)

Microsoft provide auto-discoverable OIDC setup, check document below.

- Doc: <https://docs.microsoft.com/zh-tw/azure/active-directory/develop/v2-protocols-oidc>
- Path: <https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration>

Since Active Directory is the core of Microsoft's permission management, this setup may be the most scary service provider of all. The discover-path provided above grant access to anyone having a Microsoft account. If you are tageting to specified organization, check doc for details.

The userinfo response from Microsoft looks like:

```json
{
  "family_name": "USER_FAMILY_NAME",
  "sub": "MICROSOFT_USER_ID",
  "picture": "AUTHORIZATION_REQUIRED_USER_AVATAR",
  "given_name": "USER_GIVEN_NAME",
  "email": "USER_EMAIL",
  "name": "USER_DISPLAY_NAME"
}
```

There are no `username`, `siteUrl`, `bio` nor `organisation`. Notice that the given `avatarUrl` require authorization.

### [Yahoo.com](https://developer.yahoo.com/oauth2/guide/openid_connect/)

- Doc: <https://developer.yahoo.com/oauth2/guide/openid_connect/>
- Path: <https://api.login.yahoo.com/.well-known/openid-configuration>

### [Yahoo.co.jp](https://developer.yahoo.co.jp/yconnect/v2/)

- Doc: <https://developer.yahoo.co.jp/yconnect/v2/>
- Path: <https://auth.login.yahoo.co.jp/yconnect/v2/.well-known/openid-configuration>

### [SalesForce](https://help.salesforce.com/articleView?id=sso_provider_sfdc.htm)

- Doc: <https://help.salesforce.com/articleView?id=sso_provider_sfdc.htm>
- Path: <https://login.salesforce.com/.well-known/openid-configuration>

### [LINE](https://developers.line.biz/en/docs/line-login/integrate-line-login/)

- Doc: <https://developers.line.biz/en/docs/line-login/integrate-line-login/>
- Path: <https://access.line.me/.well-known/openid-configuration>

### [Apple](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)

- Doc: <https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api>
- Path: <https://appleid.apple.com/.well-known/openid-configuration>

## OpenId Connect client

### [node-openid-client](https://github.com/panva/node-openid-client)

- Doc: <https://github.com/panva/node-openid-client/blob/master/docs/README.md>
