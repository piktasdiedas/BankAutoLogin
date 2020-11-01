/* global chrome */
import StorageType from '../constants/StorageType'

export const getFromStorage = async (p) => {
  const storageType = p.storageType || StorageType.SYNC
  return new Promise((resolve, reject) => {
    chrome.storage[storageType].get([p.key], result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
      } else {
        resolve({ ...result[p.key] })
      }
    })
  })
}

export const putToStorage = async (p) => {
  // const settings = (await getFromStorage({ key: 'settings', storageType: StorageType.SYNC }))
  const storageType = p.storageType || StorageType.SYNC
  return new Promise((resolve, reject) => {
    chrome.storage[storageType].set({ [p.key]: p.val }, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
      } else {
        setTimeout(() => resolve(p.val), 500)
      }
    })
  })
}
