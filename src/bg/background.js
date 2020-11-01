import { getFromStorage, putToStorage } from '../utils/StorageUtils'
import StorageType from '../constants/StorageType'
import MessageType from '../constants/MessageAction'

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(details => {
    const initialSettings = {
      autoFillIn: false,
      autoLogIn: false,
      language: '',
      fancyLayout: false,
      storageType: StorageType.LOCAL,
      finishedGuideStep: 0
    }
    const test = []

    if (chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.storage.sync.set({ settings: initialSettings }, result => {})
      chrome.storage.sync.set({ logins: { data: [...test] } }, result => {})
    }
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    const settings = (await getFromStorage({ key: 'settings', storageType: StorageType.SYNC }))
    const storageType = settings.storageType
    const logins = await getFromStorage({ key: 'logins', storageType: settings.storageType })
    if (request.action === MessageType.INSERT_LOGIN) {
      const maxId = Math.max(0, ...logins.data.map(l => Number(l.id)).filter(Boolean)) + 1
      logins.data.push({ ...request.data, id: maxId })

      await putToStorage({ key: 'logins', val: logins, storageType })
      sendResponse({ success: true, data: logins.data.find(l => l.id === maxId) })
    } else if (request.action === MessageType.UPDATE_LOGIN) {
      const index = logins.data.findIndex(l => l.id === request.data.id)
      if (index !== -1) {
        logins.data.splice(index, 1, { ...request.data })

        await putToStorage({ key: 'logins', val: logins, storageType })
        sendResponse({ success: true, data: logins.data[index] })
      } else {
        sendResponse({ success: false, message: `No record with id: '${request.data.id}' was found.` })
      }
    } else if (request.action === MessageType.DELETE_LOGIN) {
      const index = logins.data.findIndex(l => l.id === request.data.id)
      if (index !== -1) {
        logins.data.splice(index, 1)

        await putToStorage({ key: 'logins', val: logins, storageType })
        sendResponse({ success: true })
      } else {
        sendResponse({ success: false, message: `No record with id: '${request.data.id}' was found.` })
      }
    } else if (request.action === MessageType.DELETE_ALL_LOGINS) {
      logins.data = []

      await putToStorage({ key: 'logins', val: logins, storageType })
      sendResponse({ success: true })
    } else if (request.action === MessageType.MOVE_LOGINS) {
      const loginsFrom = await getFromStorage({ key: 'logins', storageType: request.data.from })
      const loginsTo = await getFromStorage({ key: 'logins', storageType: request.data.to })
      let maxId = Math.max(0, ...loginsTo.data.map(l => Number(l.id)).filter(Boolean)) + 1

      for (const l of loginsFrom.data) {
        l.id = maxId++
        loginsTo.data.push(l)
      }

      loginsFrom.data = []
      await putToStorage({ key: 'logins', val: loginsTo, storageType: request.data.to })
      await putToStorage({ key: 'logins', val: loginsFrom, storageType: request.data.from })
      sendResponse({ success: true })
    }
  })()

  return true
})