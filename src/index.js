import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

import App from 'App'
import { SettingsContextProvider } from 'contexts/SettingsContext'
import { getFromStorage } from 'utils/StorageUtils'
import { dummyCreateStorage } from 'utils/DummyUtils'

import './index.css'

// eslint-disable-next-line camelcase
import common_en from 'translations/en/common.json'
// eslint-disable-next-line camelcase
import common_lt from 'translations/lt/common.json'

if (process.env.NODE_ENV === 'development') {
  console.log('Creating dummy storage.')
  dummyCreateStorage()
}

getFromStorage({ key: 'settings' })
  .then(s => {
    i18next.init({
      lng: s.language || 'en',
      fallbackLng: 'en',
      interpolation: false,
      resources: {
        en: {
          common: common_en
        },
        lt: {
          common: common_lt
        }
      }
    },
    () => {
      ReactDOM.render(
        // <React.StrictMode>
        <I18nextProvider i18n={i18next}>
          <SettingsContextProvider>
            <App />
          </SettingsContextProvider>
        </I18nextProvider>,
        // </React.StrictMode>,
        document.getElementById('root')
      )

      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.unregister()
    })
  })
