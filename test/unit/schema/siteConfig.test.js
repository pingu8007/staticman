const SiteConfig = require('../../../siteConfig')
const sampleData = require('../../helpers/sampleData')
const yaml = require('js-yaml')

describe('Validate siteConfig schema', () => {

  /**
   * Dummy RSA decrypter
   * 
   * Return value without any processes
   */
  const mockRsa = {
    decrypt: (val, encode) => val
  }

  test('Use sampleData.config1', () => {
    const rawContent = yaml.safeLoad(sampleData.config1, 'utf8').comments
    expect(() => SiteConfig(rawContent, mockRsa)).not.toThrow()
  })
  test('Use sampleData.config2', () => {
    const rawContent = yaml.safeLoad(sampleData.config2, 'utf8').comments
    expect(() => SiteConfig(rawContent, mockRsa)).not.toThrow()
  })
  test('Use sampleData.config3', () => {
    expect(() => yaml.safeLoad(sampleData.config3, 'utf8')).toThrow(yaml.YAMLException)
  })
  test('Use sampleData.customProvider', () => {
    const rawContent = yaml.safeLoad(sampleData.customProvider, 'utf8').comments
    expect(() => SiteConfig(rawContent, mockRsa)).not.toThrow()
  })
  test('Use sampleData.duplicatedProviders', () => {
    const rawContent = yaml.safeLoad(sampleData.duplicatedProviders, 'utf8').comments
    expect(() => SiteConfig(rawContent, mockRsa)).toThrow('provider name conflicted')
  })
  test('Use sampleData.providerAsString', () => {
    const rawContent = yaml.safeLoad(sampleData.providerAsString, 'utf8').comments
    expect(() => SiteConfig(rawContent, mockRsa)).toThrow('must be of type Array')
  })
  test('Use sampleData.configInvalidYML', () => {
    expect(() => yaml.safeLoad(sampleData.configInvalidYML, 'utf8')).toThrow(yaml.YAMLException)
  })

})
