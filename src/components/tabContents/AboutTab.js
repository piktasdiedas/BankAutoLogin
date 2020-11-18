/* global chrome */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import StarRateIcon from '@material-ui/icons/StarRate'
import StorageType from 'constants/StorageType'
import { getFromStorage } from 'utils/StorageUtils'

import './AboutTab.css'

const AboutTab = ({ t }) => {
  const [userData, setUserData] = useState({})
  const version = chrome.runtime.getManifest
    ? chrome.runtime.getManifest().version : 'unknown'

  const rateUrl = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getFromStorage({ key: 'userData', storageType: StorageType.SYNC })
      setUserData(data || {})
    }
    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='aboutTab_container'>
      <div className='about_timeAutoFillContainer'>
        <div>{userData.timesAutoFill || 0}</div>
        <div>{t('about.timesAutoFilledIn')}</div>
      </div>
      <hr className='about_separator' />
      <div>
        by <a href='https://mantas.app' rel='noopener noreferrer' target='_blank'>Mantas Cekanauskas</a>
      </div>
      <div>{t('about.version')} - {version}</div>
      <hr className='about_separator' />
      <div className='rate_container'>
        <a href={rateUrl} rel='noopener noreferrer' target='_blank'>Rate</a>
      </div>
      <div className='rate_container'>
        <a href={rateUrl} rel='noopener noreferrer' target='_blank'>
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
        </a>
      </div>
    </div>
  )
}

AboutTab.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['common'])(AboutTab)
