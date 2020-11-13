export const Constants = {
  Banks: [
    {
      id: 'seb',
      logo: 'https://sebgroup.com/UI/V2/gfx/SEBlogo.svg',
      loginOptions: [
        { id: 'smartid', loginCredentials: ['idcode', 'identity'], path: '#Smartbtn' },
        { id: 'msignature', loginCredentials: ['idcode', 'identity'], path: '#MOBbtn' },
        { id: 'generator', loginCredentials: ['idcode'], path: '#Codebtn' }
      ],
      loginCredentials: [
        { id: 'idcode', path: '#username1' },
        { id: 'identity', path: '#idcode1' },
        { id: 'phone', path: '#newphone' }
      ],
      loginPath: '#loginpage input[type="submit"]',
      loginOptionFlow: [
        { action: 'set', key: 'checked', value: 'true' },
        { action: 'trigger', value: 'click' }
      ],
      shouldLoginPath: ['#loginpage input[type="submit"]'],
      shouldStopPath: [],
      importFromBrowserConfig: {
        type: 'checked',
        condition: true,
        prop: 'id'
      }
    },
    {
      id: 'swed',
      logo: 'https://www.swedbank.com/content/dam/swedbank/corporate/om-oss/bankens-historia/koncernens-symboler-genom-tiderna/img_100046.jpg',
      loginOptions: [
        { id: 'smartid', loginCredentials: ['idcode', 'identity'], path: '#loginTab_SMART_ID, .login-widget__tabs .ui-tabs__caption:nth-child(1) button', pathImport: '#loginTab_SMART_ID, .login-widget__tabs .ui-tabs__caption:nth-child(1)' },
        { id: 'msignature', loginCredentials: ['idcode', 'identity'], path: '#loginTab_CERTIFICATE, .login-widget__tabs .ui-tabs__caption:nth-child(2) button', pathImport: '#loginTab_CERTIFICATE, .login-widget__tabs .ui-tabs__caption:nth-child(2)' },
        { id: 'generator', loginCredentials: ['idcode', 'identity'], path: '#loginTab_MOBILE_ID, .login-widget__tabs .ui-tabs__caption:nth-child(3) button', pathImport: '#loginTab_MOBILE_ID, .login-widget__tabs .ui-tabs__caption:nth-child(3)' },
        { id: 'idcard', loginCredentials: ['idcode', 'identity', 'phone'], path: '#loginTab_PIN_CALCULATOR, .login-widget__tabs .ui-tabs__caption:nth-child(4) button', pathImport: '#loginTab_PIN_CALCULATOR, .login-widget__tabs .ui-tabs__caption:nth-child(4)' }
      ],
      loginCredentials: [
        { id: 'idcode', path: '#userId, input[name="userId"]' },
        { id: 'identity', path: '#authNumber, input[name="identityNumber"]' },
        { id: 'phone', path: '#authPwd, input[name="phoneNumber"]' },
        { id: 'generetedPass', npath: '#authPwd, input[name="pinCalcPassword"]' }
      ],
      loginPath: '#pwdLoginButton, #CERTIFICATE button[type="submit"]',
      loginOptionFlow: [
        { action: 'trigger', value: 'click' }
      ],
      shouldLoginPath: ['#pwdLoginButton, #CERTIFICATE button[type="submit"]'],
      shouldStopPath: ['#loginErrorMessage > div'],
      importFromBrowserConfig: {
        type: 'class',
        condition: ['active', '-active'],
        prop: 'id'
      }
    },
    {
      id: 'luminordnb',
      logo: 'https://www.swedbank.com/content/dam/swedbank/corporate/om-oss/bankens-historia/koncernens-symboler-genom-tiderna/img_100046.jpg',
      loginOptions: [
        { id: 'smartid', loginCredentials: ['idcode', 'identity'], path: '#SmartId a', pathImport: '#SmartId' },
        { id: 'generator', loginCredentials: ['idcode'], path: '#PINandVSC a', pathImport: '#PINandVSC' },
        { id: 'msignature', loginCredentials: ['idcode', 'identity'], path: '#wPKINoPwd a', pathImport: '#wPKINoPwd' },
        { id: 'esignature', loginCredentials: [], path: '#PKINoPwd a', pathImport: '', disabled: true }
      ],
      loginCredentials: [
        { id: 'idcode', path: '#text' },
        { id: 'identity', path: '#PersonCode' }
      ],
      loginPath: '#logout',
      loginOptionFlow: [
        { action: 'trigger', value: 'click' }
      ],
      shouldLoginPath: ['#logout'],
      shouldStopPath: ['.infobox.error'],
      importFromBrowserConfig: {
        type: 'class',
        condition: ['active'], // 'checked'
        prop: 'id'
      }
    }
    // https://online.citadele.lv/ibbf/lt_lt?loginType=mobile_scan
    // https://e.sb.lt/public/login,  https://online.sb.lt/ib/site/login#
    // https://www.bridge.luminorgroup.com/login?language=lt
  ],
  CipherRestrictionsForLoginOption: {
    idcode: {},
    identity: { 0: '3456' },
    // phone: { 0: '6' },
    generetedPass: {}
  },
  LoginOptions: [
    { id: 'smartid', name: 'Smart-ID', forBank: ['seb', 'swed'], loginCredentials: ['idcode', 'identity'] },
    { id: 'msignature', name: 'M. Parašas', forBank: ['seb', 'swed'], loginCredentials: ['idcode', 'identity'] },
    { id: 'generator', name: 'Generatorius', forBank: ['seb', 'swed'], loginCredentials: ['idcode', 'identity'] },
    { id: 'idcard', name: 'ID-kortelė', forBank: ['swed'], loginCredentials: ['idcode', 'identity', 'phone'] }
  ],
  LoginCredentials: [
    { id: 'idcode', name: 'Naudotojo ID' },
    { id: 'identity', name: 'Asmens kodas' },
    { id: 'phone', name: 'Telefonas' }
  ],
  AvailableLanguages: [
    { key: 'en', name: 'English' },
    { key: 'lt', name: 'Lietuvių' }
  ]
}
