import { Constants } from '../constants/Constants'
import StorageType from '../constants/StorageType'
import { getFromStorage, putToStorage } from '../utils/StorageUtils'
import MessageType from '../constants/MessageAction'
import { decrypt } from '../utils/CryptoUtils'
import { getIdFromUrl, deep } from '../utils/GeneralUtils'

const instructionsTemplate = [
  { action: 'setLoginOption' },

  { action: 'setCredentials' },

  { action: 'setLogin' },

  { action: 'trigger', value: 'click', subAction: 'login' }
]

const instructionProcesor = (instructions, autoLogIn) => {
  let filledAtleastOnce = false

  let domElement = null
  for (const ins of instructions) {
    switch (ins.action) {
      case 'select':
        domElement = document.querySelector(ins.value)
        break
      case 'set':
        if (domElement) {
          domElement[ins.key] = ins.value
          filledAtleastOnce = true
        }
        break
      case 'trigger':
        if (ins.subAction !== 'login' || (ins.subAction === 'login' && autoLogIn)) {
          if (domElement) {
            domElement.dispatchEvent(new Event(ins.value))
          }
        }
        break
      case 'setCss':
        domElement.style.setProperty(ins.key, ins.value, 'important')
        break
      case 'setCredentials':
      case 'setLoginOption':
      case 'setLogin':
        break
      default:
        Error(`Unknown instruction with action '${ins.action}'`)
    }
  }

  if (filledAtleastOnce) {
    getFromStorage({ key: 'userData' })
      .then(userData => {
        console.log(userData)
        userData.timesAutoFill = userData.timesAutoFill + 1
        putToStorage({ key: 'userData', val: userData, storageType: StorageType.SYNC })
      })
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case MessageType.COPY_FROM_CREDENTIALS: {
      const response = {
        loginOption: '',
        credentials: {}
      }

      for (const option of request.config.loginOptions) {
        const el = document.querySelector(option.pathImport || option.path)
        const satisfiesConditins = request.config.type === 'class'
          ? request.config.condition.some(c => el.classList.contains(c))
          : el[request.config.type]

        if (satisfiesConditins) {
          response.loginOption = option.key
          break
        }
      }

      for (const field of request.config.loginCredentials) {
        if (!field.path) continue

        const input = document.querySelector(field.path)
        if (!input) continue

        response.credentials[field.key] = input.value
      }

      sendResponse(response)
      break
    }
    case MessageType.POPULATE_CREDENTIALS: {
      (async () => {
        const login = request.login
        const bank = Constants.Banks.find(b => b.id === login.bank)

        const settings = await getFromStorage({ key: 'settings' })
        const instructions = getInstructions(bank, login)
        instructionProcesor(instructions, settings.autoLogIn)

        sendResponse({ allGood: 'ok' })
        return true
      })()
      return true
    }
    default:
      break
  }
})

const getInstructions = (bank, login) => {
  let secretKey = ''
  if (login.isEncrypted) {
    const p = window.prompt('Enter secret key to encrypt and decrypt for sensitive data encryption.')
    if (p !== null) {
      secretKey = p
    }
  }

  login = (secretKey && login.isEncrypted)
    ? decrypt(login, secretKey)
    : login

  const instructions = deep(instructionsTemplate)
  const loginOption = bank.loginOptions.find(lo => lo.id === login.loginOption)
  const credentials = bank.loginCredentials

  const loginOptionIndex = instructions.findIndex(i => i.action === 'setLoginOption')
  instructions.splice(loginOptionIndex, 1,
    { action: 'select', value: loginOption.path },
    ...bank.loginOptionFlow
  )

  const credentialsIndex = instructions.findIndex(i => i.action === 'setCredentials')
  for (let i = 0; i < login.credentials.length; i++) {
    const c = login.credentials[i]
    if (c.value === '') continue

    instructions.splice(credentialsIndex + (i * 2), i === 0 ? 1 : 0,
      { action: 'select', value: credentials.find(x => x.id === c.id).path },
      { action: 'set', key: 'value', value: c.value }
    )
  }

  const loginIndex = instructions.findIndex(i => i.action === 'setLogin')
  instructions.splice(loginIndex, 1,
    { action: 'select', value: bank.loginPath }
  )

  return instructions
}

const shouldLogin = (arr) => {
  if (arr.length === 0) return false

  let login = true

  for (const selector of arr) {
    if (!document.querySelector(selector)) {
      login = false
    }
  }
  return login
}

const shouldStop = (arr) => {
  if (arr.length === 0) return false

  let stop = false

  for (const selector of arr) {
    if (document.querySelector(selector)) {
      stop = true
    }
  }
  return stop
}

(async () => {
  const bankId = getIdFromUrl(document.location.toString())

  const bank = Constants.Banks.find(b => b.id === bankId)
  if (shouldLogin(bank.shouldLoginPath) &&
    !shouldStop(bank.shouldStopPath)) {
    const settings = await getFromStorage({ key: 'settings' })
    if (settings.autoFillIn) {
      const logins = await getFromStorage({ key: 'logins', storageType: settings.storageType })
      const mainLogin = logins.data.find(l => l.bank === bankId && l.isMain)
      if (mainLogin) {
        const instructions = getInstructions(bank, mainLogin)

        instructionProcesor(instructions, settings.autoLogIn)
      }
    }
  }
})()
