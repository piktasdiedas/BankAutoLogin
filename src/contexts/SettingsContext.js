import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import i18next from 'i18next'

import { getFromStorage, putToStorage } from 'utils/StorageUtils'

export const SettingsContext = React.createContext({
  settings: {},
  setSettigns: {},
  settingsChanged: () => {}
})

export const SettingsContextProvider = ({ children }) => {
  const [settings, setSettingsInState] = useState({})

  useEffect(() => {
    (async () => {
      const s = await getFromStorage({ key: 'settings' })
      setSettingsInState(s)
    })()
  }, [])

  const settingsChanged = (newSettings) => {
    (async () => {
      const s = await getFromStorage({ key: 'settings' })

      if (newSettings.language && s.language !== newSettings.language) {
        i18next.changeLanguage(newSettings.language)
      }

      for (const key in newSettings) {
        s[key] = newSettings[key]
      }
      await putToStorage({ key: 'settings', val: s })
      setSettingsInState(s)
    })()
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings: setSettingsInState, settingsChanged }}>
      {children}
    </SettingsContext.Provider>
  )
}

SettingsContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
