export const dummyCreateStorage = () => {
  // return
  if (!window.chrome) window.chrome = {}

  if (!window.dummyData) {
    window.dummyData = {}
    window.dummyData.settings = { language: 'en', storageType: 'local', finishedGuideStep: 10, fancyLayout: true }
    window.dummyData.logins = {}
    window.dummyData.logins.data = [{ id: 1, bank: 'seb', loginOption: 'msignature', isEncrypted: false, credentials: [] }]
    window.dummyData.logins.data.push({ id: 2, bank: 'seb', loginOption: '', isEncrypted: false, credentials: [{ id: 'identity', value: 675864534 }] })
    window.dummyData.logins.data.push({ id: 3, bank: 'seb', loginOption: 'msignature', isEncrypted: false, credentials: [{ id: 'idcode', value: 32323232 }, { id: 'identity', value: 7654326 }] })
  }

  if (!window.chrome.storage) {
    window.chrome.storage = {}
    window.chrome.storage.local = {}
    window.chrome.storage.sync = window.chrome.storage.local

    window.chrome.storage.local.get = (key, callbackFunc) => {
      callbackFunc({ [key]: window.dummyData[key] })
    }

    window.chrome.storage.local.set = (p, callback) => {
      for (const key in p) {
        if (Object.prototype.hasOwnProperty.call(p, key)) {
          window.dummyData[key] = p[key]
        }
      }
      callback(p)
    }

    window.chrome.storage.sync = window.chrome.storage.local
  }
}
