import { deep } from './GeneralUtils'
import { Constants } from '../constants/Constants'

const encryptDecrypt = (useEncryption, login, secretKey) => {
  const copy = deep(login)

  for (const c of copy.credentials) {
    if (c.value.toString() === '') continue

    const ms = Constants.CipherRestrictionsForLoginOption[c.id] || {}
    const encryptedDecryptedText = useEncryption
      ? e2(c.value.toString(), secretKey, ms)
      : d2(c.value.toString(), secretKey, ms)
    c.value = encryptedDecryptedText
  }

  return copy
}

const n = '0123456789'.split('')
const f = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

const e2 = (str, key, ms) => {
  const sn = key.split('').map(c => c.charCodeAt(0)).reduce(_hash)
  const ao = [...(str.split('').every(x => n.includes(x)) ? n : f)]
  const an = t(sn, key.charCodeAt(0), ao)

  const res = []
  for (let i = 0; i <= str.length - 1; i++) {
    const a = ms[i] ? t(sn, key.charCodeAt(0), ms[i]) : an
    const idx = [...(ms[i] ? ms[i] : ao)].indexOf(str[i])
    res.push((idx !== -1) ? a[idx] : str[i])
    an.unshift(an.pop())
  }

  return res.join('')
}

const d2 = (str, key, ms) => {
  const sn = key.split('').map(c => c.charCodeAt(0)).reduce(_hash)
  const ao = [...(str.split('').every(x => n.includes(x)) ? n : f)]
  const an = t(sn, key.charCodeAt(0), ao)
  for (let i = 0; i < str.length - 1; i++) {
    an.unshift(an.pop())
  }

  const res = []
  for (let i = str.length - 1; i >= 0; i--) {
    const a = ms[i] ? ms[i] : ao
    const idx = [...(ms[i] ? t(sn, key.charCodeAt(0), ms[i]) : an)].indexOf(str[i])
    res.unshift((idx !== -1) ? a[idx] : str[i])
    an.push(an.shift())
  }

  return res.join('')
}

const t = (sn_, s_, ao, c) => {
  const ma = [3, 5, 1, 6, 4, 2, 4, 8, 0, 7]

  if (ao.length === 1) {
    return ao
  } else {
    while (ma.length > ao.length) {
      ma.splice(ma.indexOf(Math.max(...ma)), 1)
    }
  }

  const tempStr = (((sn_ > 19 ? sn_ : sn_ * 11))).toString().split('')

  const sn = Number(tempStr.join('')) * 3
  const s = s_ % ma.length

  let an = [...ao]
  let pos = 0
  let sw = 0
  let tmod = 0
  const end = an.length - 1
  let i = 0
  while (i < sn) {
    tmod = i % ma.length
    pos = ma[tmod]
    sw = i % 3

    if (sw === 0) {
      [an[end], an[pos]] = [an[pos], an[end]];
      [an[tmod], an[s]] = [an[s], an[tmod]]
    } else if (sw === 1) {
      [an[0], an[s]] = [an[s], an[0]];
      [an[end], an[tmod]] = [an[tmod], an[end]]
    } else if (sw === 2) {
      [an[0], an[pos]] = [an[pos], an[0]];
      [an[end], an[s]] = [an[s], an[end]]
    }
    if (!c) {
      an = t(ao.length + pos, s, an, true)
    }
    an.push(an.shift())
    i++
  }

  return an
}

const _hash = (a, b, i) => a + (b * ((i % 5) + 1) + (b % 9))

export const encrypt = (login, secretKey) => encryptDecrypt(true, login, secretKey)

export const decrypt = (login, secretKey) => encryptDecrypt(false, login, secretKey)
