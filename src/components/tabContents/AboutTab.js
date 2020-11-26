/* global chrome */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import StarRateIcon from '@material-ui/icons/StarRate'
import StorageType from 'constants/StorageType'
import { getFromStorage } from 'utils/StorageUtils'
import CustomLink from 'components/CustomLink'

import './AboutTab.css'

const AboutTab = ({ t }) => {
  const [userData, setUserData] = useState({})
  const version = chrome.runtime.getManifest
    ? chrome.runtime.getManifest().version : 'unknown'

  const devUrl = 'https://mantas.app'
  const rateUrl = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`
  const sourceCodeUrl = 'https://github.com/piktasdiedas/BankAutoLogin'

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
        by <CustomLink href={devUrl}>Mantas Cekanauskas</CustomLink>
      </div>
      <div>{t('about.version')} - {version}</div>
      <hr className='about_separator' />
      <div>
        Source code in <CustomLink href={sourceCodeUrl}>GitHub</CustomLink>
      </div>
      <hr className='about_separator' />
      <div className='rate_container'>
        <CustomLink href={rateUrl}>Rate</CustomLink>
      </div>
      <div className='rate_container'>
        <CustomLink href={rateUrl}>
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
          <StarRateIcon />
        </CustomLink>
      </div>
    </div>
  )
}

AboutTab.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['common'])(AboutTab)
