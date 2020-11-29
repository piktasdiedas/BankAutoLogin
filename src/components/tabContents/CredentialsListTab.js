/* global chrome */
import React, { useState, useEffect, useContext } from 'react'
import { Select, MenuItem, TextField, FormControl, InputLabel, Checkbox } from '@material-ui/core'
import PropTypes from 'prop-types'

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import GetAppIcon from '@material-ui/icons/GetApp'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import PublishIcon from '@material-ui/icons/Publish'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { makeStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'

import './CredentialsListTab.css'

import withLoaderBar from 'components/withLoaderBar'
import ButtonWithTooltipAndIcon from 'components/ButtonWithTooltipAndIcon'
import { Constants } from 'constants/Constants'
import MessageType from 'constants/MessageAction'
import { getFromStorage } from 'utils/StorageUtils'
import { encrypt, decrypt } from 'utils/CryptoUtils'
import { SettingsContext } from 'contexts/SettingsContext'
import { getIdFromUrl, deep } from 'utils/GeneralUtils'

const emptyLogin = {
  id: 0,
  bank: '',
  loginOption: '',
  credentials: [],
  isMain: true,
  isEncrypted: false
}

const useStyles = makeStyles({
  root: {
    background: 'green',
    justifyContent: 'flex-end'
  },
  checkbox: {
    padding: 0,
    marginTop: '16px'
  }
})

const Banks = Constants.Banks

const CredentialsList = ({ t, setLoading }) => {
  const customClasses = useStyles()
  const { settings } = useContext(SettingsContext)

  const [logins, setLogins] = useState([])
  const [editable, setEditable] = useState(null)

  useEffect(() => {
    setLoading(true)
    const fetchLogins = async () => {
      const logins = await getFromStorage({ key: 'logins', storageType: settings.storageType })
      setLogins(logins.data || [])
      setLoading(false)
    }
    fetchLogins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleAddNew = (login) => {
    const newLogin = deep(login)
    setLogins([newLogin, ...logins])
    setEditable(deep(newLogin))
  }

  const handleEdit = (login) => {
    setEditable(deep(login))
  }

  const handleSave = () => {
    let allowToSave = !(settings.warnAboutPassword && !editable.isEncrypted)
    if (!allowToSave) {
      allowToSave = window.confirm(t('savedCredentials.warnAndConfirmAboutPassword'))
    }

    if (allowToSave) {
      setLoading(true)
      const actionType = editable.id ? MessageType.UPDATE_LOGIN : MessageType.INSERT_LOGIN
      chrome.runtime.sendMessage({ action: actionType, data: editable }, result => {
        if (result.success) {
          const copy = [...logins]
          copy.splice(copy.findIndex(x => x.id === editable.id), 1, { ...result.data })
          setLogins(copy)
          setEditable(null)
        }
        setLoading(false)
      })
    }
  }

  const handleDelete = (login) => {
    chrome.runtime.sendMessage({ action: MessageType.DELETE_LOGIN, data: login }, result => {
      if (result.success) {
        const copy = [...logins]
        copy.splice(copy.findIndex(x => x.id === login.id), 1)
        setLogins(copy)
        setEditable(null)
      }
    })
  }

  const handleCancel = () => {
    if (!editable.id) {
      const copy = [...logins]
      copy.splice(copy.findIndex(x => x.id === editable.id), 1)
      setLogins(copy)
    }

    setEditable(null)
  }

  const handlePopulateCredentials = (login) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: MessageType.POPULATE_CREDENTIALS,
        login
      }, response => {})
    })
  }

  const handleImportFromBrowser = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      const bankId = getIdFromUrl(tabs[0].url)

      if (bankId === '') {
        return
      }

      const bank = Constants.Banks.find(b => b.id === bankId)
      const config = deep(bank.importFromBrowserConfig)
      config.loginOptions = bank.loginOptions
        .map(lo => ({ key: lo.id, path: lo.path, pathImport: lo.pathImport }))

      config.loginCredentials = bank.loginCredentials
        .map(c => ({ key: c.id, path: c.path }))

      chrome.tabs.sendMessage(tabs[0].id, {
        action: MessageType.COPY_FROM_CREDENTIALS,
        config: config
      },
      response => {
        const newLogin = {
          bank: bank.id,
          loginOption: response.loginOption,
          credentials: [],
          isMain: true,
          isEncrypted: false
        }

        const loginOption = bank.loginOptions.find(lo => lo.id === response.loginOption)
        const requiredLogins = bank.loginCredentials.filter(c => loginOption.loginCredentials.includes(c.id))
        for (const credential of requiredLogins) {
          newLogin.credentials.push({
            id: credential.id,
            value: response.credentials[credential.id] || ''
          })
        }

        handleAddNew(newLogin)
      })
    })
  }

  const handleDeleteAll = () => {
    setLoading(true)
    chrome.runtime.sendMessage({ action: MessageType.DELETE_ALL_LOGINS }, result => {
      if (result.success) {
        setLogins([])
        setEditable(null)
      }
      setLoading(false)
    })
  }

  const onBankChange = e => {
    setEditable({
      ...editable,
      id: editable.id,
      bank: e.target.value,
      loginOption: '',
      credentials: [],
      isEncrypted: false
    })
  }

  const onLoginOptionChange = (e) => {
    const loginOption = Banks.find(b => b.id === editable.bank)
      .loginOptions.find(lo => lo.id === e.target.value)
    const creadentials = Banks.find(b => b.id === editable.bank)
      .loginCredentials.filter(lc =>
        loginOption.loginCredentials.includes(lc.id)
      )

    setEditable({
      ...editable,
      id: editable.id,
      bank: editable.bank,
      loginOption: e.target.value,
      credentials: creadentials.map(c => ({ id: c.id, value: editable.credentials.find(old => old.id === c.id)?.value ?? '' })),
      isEncrypted: false
    })
  }

  const onCredentialChange = (id, val) => {
    const copy = deep(editable.credentials)
    const index = copy.findIndex(x => x.id === id)

    copy.splice(index, 1, { ...copy[index], value: val })

    setEditable({
      ...editable,
      credentials: copy
    })
  }

  const onEncryptionChange = (useEncryption) => {
    if ((useEncryption && editable.isEncrypted) ||
      (!useEncryption && !editable.isEncrypted)) {
      throw new Error(`Invalid state detected -> useEncryption: '${useEncryption}'; isEncrypted: '${editable.isEncrypted}'`)
    }

    const secretKey = window.prompt('Enter secret key to encrypt and decrypt for sensitive data encryption.')
    if (secretKey === null || secretKey === '') return

    const copy = useEncryption ? encrypt(editable, secretKey) : decrypt(editable, secretKey)

    copy.isEncrypted = useEncryption
    setEditable(copy)
  }

  const readonlyTextFielProps = {
    fullWidth: true,
    InputProps: { disableUnderline: true, readOnly: true }
  }

  const calclateColumnsWidth = (login) => {
    if (settings.fancyLayout) {
      return {
        bank: '100%',
        option: '100%',
        credential: '100%',
        encrypted: '30%',
        main: '30%',
        controls: 'auto'
      }
    }
    const width = {
      bank: 15,
      option: 18,
      encrypted: 10,
      main: 10,
      controls: 15
    }
    const leftover = 100 - Object.entries(width).map(e => e[1]).reduce((t, x) => t + x, 0)

    width.credential = login.credentials.length === 0
      ? leftover : leftover / login.credentials.length

    for (const key in width) {
      width[key] = `${width[key]}%`
    }
    return width
  }

  const renderReadonlyRow = (login) => {
    const colsWidth = calclateColumnsWidth(login)

    return (
      <div className='b_row b_row_readonly' key={login.id}>
        <div style={{ width: colsWidth.bank }} className='b_column'>
          <TextField
            { ...readonlyTextFielProps }
            fullWidth
            label={t('savedCredentials.bank')}
            value={t(`savedCredentials.${login.bank}.name`)}
          />
        </div>
        <div style={{ width: colsWidth.option }} className='b_column'>
          <TextField
            { ...readonlyTextFielProps }
            fullWidth
            label={t('savedCredentials.login')}
            value={!login.loginOption ? '--' : t(`savedCredentials.${login.bank}.${login.loginOption}`)}
          />
        </div>
        { login.credentials.length !== 0
          ? login.credentials.map(c =>
            <div style={{ width: colsWidth.credential }} key={c.id} className='b_column'>
              <TextField
                { ...readonlyTextFielProps }
                fullWidth
                label={t(`savedCredentials.${login.bank}.${c.id}`)}
                value={login.isEncrypted ? '***********' : c.value}
              />
            </div>
          )
          : (<div style={{ width: colsWidth.credential }} className='b_column'></div>)
        }
        <div style={{ width: colsWidth.encrypted }} className='b_column'>
          <TextField
            { ...readonlyTextFielProps }
            fullWidth
            label={t('savedCredentials.encrypted')}
            value={t(`savedCredentials.${(login.isEncrypted ? 'yes' : 'no')}`)}
          />
        </div>
        <div style={{ width: colsWidth.main }} className='b_column'>
          <TextField
            { ...readonlyTextFielProps }
            fullWidth
            label={t('savedCredentials.main')}
            value={t(`savedCredentials.${(login.isMain ? 'yes' : 'no')}`)}
          />
        </div>
        <div style={{ width: colsWidth.controls }} className='b_column b_column_controls'>
          <ButtonWithTooltipAndIcon
            onClick={_ => handleEdit(login)}
            tooltipText={t('savedCredentials.edit')}
            icon={<EditIcon />}
          />
          <ButtonWithTooltipAndIcon
            onClick={_ => handleDelete(login)}
            tooltipText={t('savedCredentials.delete')}
            icon={<DeleteOutlineIcon />}
          />
          <ButtonWithTooltipAndIcon
            onClick={_ => handlePopulateCredentials(login)}
            tooltipText={t('savedCredentials.fillInPassword')}
            icon={<GetAppIcon />}
          />
        </div>
      </div>
    )
  }

  const renderEditableRow = (login) => {
    const colsWidth = calclateColumnsWidth(login)

    const canEncrypt = login.credentials.some(c => c.value !== '')
    return (
      <div className='b_row b_row_editable' key={login.id}>
        <div style={{ width: colsWidth.bank }} className='b_column'>
          <FormControl style={{ width: '140px' }}>
            <InputLabel id='bank-select-label'>{t('savedCredentials.bank')}</InputLabel>
            <Select
              labelId='bank-select-label'
              value={login.bank}
              onChange={onBankChange}
              disableUnderline={true}
              fullWidth={true}
            >
              {Banks.map(b => <MenuItem key={b.id} value={b.id} >{t(`savedCredentials.${b.id}.name`)}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div style={{ width: colsWidth.option }} className='b_column'>
          <FormControl style={{ width: '140px' }}>
            <InputLabel id='loginOption-select-label'>{t('savedCredentials.login')}</InputLabel>
            <Select
              labelId='loginOption-select-label'
              disabled={!login.bank}
              value={login.loginOption}
              onChange={onLoginOptionChange}
              disableUnderline={true}
              fullWidth
            >
              {(login.bank
                ? Banks.find(b => b.id === login.bank).loginOptions
                : []).map(l => <MenuItem key={l.id} value={l.id} >{t(`savedCredentials.${login.bank}.${l.id}`)}</MenuItem>)
              }
            </Select>
          </FormControl>
        </div>
        { login.credentials.length !== 0
          ? login.credentials.map(c =>
            <div style={{ width: colsWidth.credential }} key={c.id} className='b_column'>
              <TextField
                fullWidth
                disabled={login.isEncrypted}
                label={t(`savedCredentials.${login.bank}.${c.id}`)}
                value={login.isEncrypted ? '***********' : c.value}
                onChange={e => onCredentialChange(c.id, e.target.value)}
                InputProps={{ disableUnderline: true }}
              />
            </div>
          )
          : (<div style={{ width: colsWidth.credential }} className='b_column'></div>)
        }
        <div style={{ width: colsWidth.encrypted }} className='b_column'>
          <FormControl>
            <InputLabel shrink={true} id='encrypted-checkbox-label'>{t('savedCredentials.encrypted')}</InputLabel>
            <Checkbox
              className={customClasses.checkbox}
              color='primary'
              label={t('savedCredentials.encrypted')}
              disabled={!canEncrypt}
              checked={login.isEncrypted || false}
              onChange={e => onEncryptionChange(!login.isEncrypted)}
            />
          </FormControl>
        </div>
        <div style={{ width: colsWidth.main }} className='b_column'>
          <FormControl>
            <InputLabel shrink={true} id='main-checkbox-label'>{t('savedCredentials.main')}</InputLabel>
            <Checkbox
              className={customClasses.checkbox}
              color='primary'
              label={t('savedCredentials.main')}
              checked={login.isMain || false}
              onChange={e => setEditable({ ...editable, isMain: !login.isMain })}
            />
          </FormControl>
        </div>
        <div style={{ width: colsWidth.controls }} className='b_column b_column_controls'>
          <ButtonWithTooltipAndIcon
            onClick={handleCancel}
            tooltipText={t('savedCredentials.cancel')}
            icon={<CloseIcon />}
          />
          <ButtonWithTooltipAndIcon
            onClick={handleSave}
            tooltipText={t('savedCredentials.save')}
            icon={<SaveIcon />}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <ButtonWithTooltipAndIcon
          disabled={!!editable}
          onClick={_ => handleAddNew(emptyLogin)}
          tooltipText={t('savedCredentials.addNew')}
          icon={<AddCircleOutlineIcon />}
          size='medium'
        />
        <ButtonWithTooltipAndIcon
          disabled={!!editable}
          onClick={handleImportFromBrowser}
          tooltipText={t('savedCredentials.importFromBrowser')}
          icon={<PublishIcon />}
          size='medium'
        />
        <ButtonWithTooltipAndIcon
          disabled={!!editable}
          onClick={handleDeleteAll}
          tooltipText={t('savedCredentials.deleteAll')}
          icon={<DeleteForeverIcon />}
          size='medium'
        />
      </div>
      <div className={`b_grid${settings.fancyLayout ? ' b_fancy' : ''}`}>
        {logins.map(l => {
          const login = (editable && l.id === editable.id) ? editable : l
          const isEditable = editable && editable.id === login.id
          return isEditable ? renderEditableRow(login) : renderReadonlyRow(login)
        })}
      </div>
    </>
  )
}

CredentialsList.propTypes = {
  t: PropTypes.func,
  setLoading: PropTypes.func
}

export default withTranslation(['common'])(withLoaderBar(CredentialsList))
