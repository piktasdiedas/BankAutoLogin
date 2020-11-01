/* global chrome */
import React from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import StarRateIcon from '@material-ui/icons/StarRate'

import './AboutTab.css'

const AboutTab = ({ t }) => {
  const version = chrome.runtime.getManifest
    ? chrome.runtime.getManifest().version : 'unknown'

  const rateUrl = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}`

  return (
    <div className='aboutTab_container'>
      <div>
        by <a href='https://mantas.app' rel='noopener noreferrer' target='_blank'>Mantas Cekanauskas</a>
      </div>
      <div>{t('about.version')} - {version}</div>
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
