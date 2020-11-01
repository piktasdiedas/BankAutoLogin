import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import { Modal, FormControlLabel, Select, MenuItem, Button } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import EditIcon from '@material-ui/icons/Edit'
import GetAppIcon from '@material-ui/icons/GetApp'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import PublishIcon from '@material-ui/icons/Publish'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { withTranslation } from 'react-i18next'
import { SettingsContext } from 'contexts/SettingsContext'

import './GuideModal.css'

const GuideModal = ({ t, isOpen, handleOnClose }) => {
  const { settings, settingsChanged } = useContext(SettingsContext)
  const [currentStep, setCurrentStep] = useState(1)

  const contentForStep1 = () => {
    return (
      <>
        <h3><ErrorOutlineIcon style={{ fill: 'red' }}/> {t('modal.content.step1.generalTitle')}</h3>
        <div>{t('modal.content.step1.instruction')}</div>
        <ul>
          <li>{t('modal.content.step1.instruction1')}</li>
          <li>{t('modal.content.step1.instruction2')}</li>
          <li>{t('modal.content.step1.instruction3')}</li>
        </ul>
      </>
    )
  }

  const contentForStep2 = () => {
    return (
      <>
        <h3><ErrorOutlineIcon style={{ fill: 'red' }}/> {t('modal.content.step2.generalTitle')}</h3>
        <ul>
          <li>{t('modal.content.step2.instruction1')}</li>
          <li>{t('modal.content.step2.instruction3')}</li>
          <li>{t('modal.content.step2.instruction4')}: <a target='_blank' rel='noopener noreferrer' href='https://www.esaugumas.lt/lt/e.-bankininkyste/patarimai-kaip-saugiai-naudotis/288'>https://www.esaugumas.lt</a></li>
        </ul>
      </>
    )
  }

  const contentForStep3 = () => {
    return (
      <>
        <h3>{t('modal.content.step3.generalTitle')}</h3>
        <ul>
          <li>{t('modal.content.step3.instruction1')}</li>
          <li>{t('modal.content.step3.instruction2')}</li>
          <li>{t('modal.content.step3.instruction3')}</li>
          <li>{t('modal.content.step3.instruction4')}</li>
        </ul>
      </>
    )
  }

  const contentForStep4 = () => {
    return (
      <>
        <h3>{t('modal.content.step4.generalTitle')}</h3>
        <ul>
          <li>{t('settings.autoFillIn')} - {t('modal.content.step4.autoFillIn')}</li>
          <li>{t('settings.autoSignIn')} - {t('modal.content.step4.autoSignIn')}</li>
          <li>{t('settings.storageType')} - {t('modal.content.step4.storageType')}</li>
          <li>{t('settings.fancyLayout')} - {t('modal.content.step4.fancyLayout')}</li>
          <li>{t('settings.warnAboutPassword')} - {t('modal.content.step4.warnAboutPassword')}</li>
        </ul>
      </>
    )
  }

  const contentForStep5 = () => {
    return (
      <>
        <h3>{t('modal.content.step5.generalTitle')}</h3>
        <ul>
          <li><AddCircleOutlineIcon /> - {t('modal.content.step5.add')}</li>
          <li><GetAppIcon /> - {t('modal.content.step5.importFromBrowser')}</li>
          <li><DeleteForeverIcon /> - {t('modal.content.step5.deleteAll')}</li>
          <li><EditIcon /> - {t('modal.content.step5.edit')}</li>
          <li><DeleteOutlineIcon /> - {t('modal.content.step5.delete')}</li>
          <li><PublishIcon /> - {t('modal.content.step5.fillInCredentials')}</li>
          <li><SaveIcon /> - {t('modal.content.step5.save')}</li>
          <li><CloseIcon /> - {t('modal.content.step5.cancel')}</li>
        </ul>
      </>
    )
  }

  const contentForStep6 = () => {
    return (
      <>
        <h3>{t('modal.content.step6.generalTitle')}</h3>
        <ul>
          <li><a href='https://www.seb.lt/' target='_blank' rel='noopener noreferrer'>{t('modal.content.step6.seb')}</a></li>
          <li><a href='https://www.swedbank.lt/' target='_blank' rel='noopener noreferrer'>{t('modal.content.step6.swed')}</a></li>
          <li><a href='https://www.luminor.lt/' target='_blank' rel='noopener noreferrer'>{t('modal.content.step6.luminordnb')}</a></li>
        </ul>
      </>
    )
  }

  const allInfo = [contentForStep1, contentForStep2, contentForStep3, contentForStep4, contentForStep5, contentForStep6]

  const canCloseModal = settings.finishedGuideStep >= allInfo.length ||
    currentStep === allInfo.length

  return (
    <Modal
      open={isOpen}
      disableBackdropClick={true}
      onClose={handleOnClose}
      className='b_modal'
    >
      <div className='b_modal_content_container'>
        {!settings.language && (
          <FormControlLabel
            control={
              <Select
                open={true}
                value={settings.language}
                onChange={e => {
                  settingsChanged({ language: e.target.value })
                }}
              >
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'lt'}>Lietuvių</MenuItem>
              </Select>
            }
            label={t('settings.language')}
            labelPlacement='start'
          />)
        }
        {settings.language && (
          <div className='b_modal_content'>
            {allInfo[currentStep - 1]()}
            <div className='b_modal_controls'>
              <Button
                disabled={currentStep === 1}
                variant='contained'
                color='primary'
                onClick={_ => {
                  setCurrentStep(currentStep - 1)
                }}
              >
                {t('modal.back')}
              </Button>
              <Button
                disabled={currentStep === allInfo.length}
                variant='contained'
                color='primary'
                onClick={_ => {
                  setCurrentStep(currentStep + 1)
                }}
              >
                {t('modal.next')}
              </Button>
              <Button
                disabled={!canCloseModal}
                variant='contained'
                color='primary'
                onClick={_ => {
                  handleOnClose()
                  if (currentStep > settings.finishedGuideStep) {
                    settingsChanged({ finishedGuideStep: currentStep })
                  }
                }}
              >
                {t('modal.close')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

GuideModal.propTypes = {
  t: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired
}

export default withTranslation(['common'])(GuideModal)
