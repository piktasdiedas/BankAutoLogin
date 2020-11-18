/* global chrome */
import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import { FormControlLabel, Checkbox, Button, Select, MenuItem } from '@material-ui/core'
import { withTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import withLoaderBar from 'components/withLoaderBar'
import StorageType from 'constants/StorageType'
import MessageType from 'constants/MessageAction'
import { Constants } from 'constants/Constants'
import { SettingsContext } from 'contexts/SettingsContext'
import { parseToBool } from 'utils/GeneralUtils'

import './SettingsTab.css'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  label: {
    width: '80%',
    textAlign: 'start',
    wordWrap: 'break-word',
    display: 'inline-table'
  }
})

const SettingsTab = ({ t, setLoading }) => {
  const [settingsState, setSettingsState] = useState({})
  const { settings, settingsChanged } = useContext(SettingsContext)
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [originalSettings, setOriginalSettings] = useState({})
  const classes = useStyles()

  useEffect(() => {
    setOriginalSettings(settings)
    setSettingsState(settings)
  }, [settings])

  const updateSettings = (name, value) => {
    let disabled = !(value !== originalSettings[name])

    for (const key in settingsState) {
      if (Object.prototype.hasOwnProperty.call(settingsState, key)) {
        if (settingsState[key] !== originalSettings[key] && key !== name) {
          disabled = false
        }
      }
    }

    if (disabled !== saveDisabled) {
      setSaveDisabled(disabled)
    }
    setSettingsState({
      ...settingsState,
      [name]: value
    })
  }

  const handleSave = async _ => {
    setLoading(true)

    settingsChanged(settingsState)

    if (originalSettings.storageType !== settingsState.storageType) {
      handleCredentialMove(originalSettings.storageType, settingsState.storageType)
    }
    setLoading(false)
    setOriginalSettings(settingsState)
    setSaveDisabled(true)
  }

  const handleCredentialMove = (from, to) => {
    chrome.runtime.sendMessage({ action: MessageType.MOVE_LOGINS, data: { from, to } }, result => {})
  }

  return (
    <>
      <div className='settings_content'>
        <div className='settings_content_part'>
          <div className='settings_content_part_col'>
            <FormControlLabel
              label={t('settings.autoFillIn')}
              labelPlacement='start'
              classes={classes}
              control={
                <Checkbox
                  checked={parseToBool(settingsState.autoFillIn, false)}
                  color='primary'
                  onClick={e => updateSettings('autoFillIn', !settingsState.autoFillIn)}
                />
              }
            />
            <FormControlLabel
              label={t('settings.autoSignIn')}
              labelPlacement='start'
              classes={classes}
              control={
                <Checkbox
                  checked={parseToBool(settingsState.autoLogIn, false)}
                  color='primary'
                  onClick={e => updateSettings('autoLogIn', !settingsState.autoLogIn)}
                />
              }
            />
            <FormControlLabel
              label={t('settings.warnAboutPassword')}
              labelPlacement='start'
              classes={classes}
              control={
                <Checkbox
                  checked={parseToBool(settingsState.warnAboutPassword, false)}
                  color='primary'
                  onClick={e => updateSettings('warnAboutPassword', !settingsState.warnAboutPassword)}
                />
              }
            />
          </div>
          <div className='settings_content_part_col'>
            <FormControlLabel
              label={t('settings.fancyLayout')}
              labelPlacement='start'
              classes={classes}
              control={
                <Checkbox
                  checked={parseToBool(settingsState.fancyLayout, false)}
                  color='primary'
                  onClick={e => updateSettings('fancyLayout', !settingsState.fancyLayout)}
                />
              }
            />
            <FormControlLabel
              label={t('settings.language')}
              labelPlacement='start'
              classes={classes}
              control={
                <Select
                  fullWidth
                  value={settingsState.language || ''}
                  onChange={e => {
                    updateSettings('language', e.target.value)
                  }}
                >
                  {
                    Constants.AvailableLanguages
                      .map(lang => <MenuItem key={lang.key} value={lang.key}>{lang.name}</MenuItem>)
                  }
                </Select>
              }
            />
            <FormControlLabel
              label={t('settings.storageType')}
              labelPlacement='start'
              classes={classes}
              control={
                <Select
                  fullWidth
                  value={settingsState.storageType || ''}
                  onChange={e => {
                    updateSettings('storageType', e.target.value)
                  }}
                >
                  <MenuItem value={StorageType.LOCAL}>{t(`savedCredentials.storage.${StorageType.LOCAL}`)}</MenuItem>
                  <MenuItem value={StorageType.SYNC}>{t(`savedCredentials.storage.${StorageType.SYNC}`)}</MenuItem>
                </Select>
              }
            />
          </div>
        </div>
        <div className='settings_content_controls'>
          <Button
            color='primary'
            variant='contained'
            disabled={saveDisabled}
            onClick={handleSave}
          >Save</Button>
        </div>
      </div>
    </>
  )
}

SettingsTab.propTypes = {
  t: PropTypes.func,
  setLoading: PropTypes.func
}

export default withTranslation(['common'])(withLoaderBar(SettingsTab))
