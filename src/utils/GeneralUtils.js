export const deep = (inObject) => {
  if (typeof inObject !== 'object' || inObject === null) {
    return inObject
  }

  const outObject = Array.isArray(inObject) ? [] : {}

  for (const key in inObject) {
    outObject[key] = deep(inObject[key])
  }

  return outObject
}

export const getIdFromUrl = (url) => {
  const bankId = url.includes('seb')
    ? 'seb' : url.includes('swedbank')
      ? 'swed' : url.includes('dnb')
        ? 'luminordnb'
        : (() => { throw new Error(`Not implemented '${url}'`) })()

  return bankId
}

export const parseToBool = (val, defaultVal) => {
  if (val === undefined || val === null) {
    return defaultVal || false
  } else if (val || val === false) {
    return val
  } else {
    return defaultVal || false
  }
}
