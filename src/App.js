import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

import { withTranslation } from 'react-i18next'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import InfoIcon from '@material-ui/icons/Info'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CloudOffIcon from '@material-ui/icons/CloudOff'
import CloudQueueIcon from '@material-ui/icons/CloudQueue'

import './App.css'

import TabContent from 'components/TabContent'
import SettingsTab from 'components/tabContents/SettingsTab'
import CredentialsList from 'components/tabContents/CredentialsListTab'
import GuideModal from 'components/modals/GuideModal'
import AboutTab from 'components/tabContents/AboutTab'
import ButtonWithTooltipAndIcon from 'components/ButtonWithTooltipAndIcon'
import TabButtonsContainer from 'components/TabButtonsContainer'

import { SettingsContext } from 'contexts/SettingsContext'
import { Internal } from 'constants/Internal'

const styles = {
  iconLabelWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'start'
  },
  icon: {
    paddingLeft: '10px'
  }
}

function App ({ t, classes }) {
  const { settings } = useContext(SettingsContext)

  const [modalOpen, setModalOpen] = useState(false)
  const [tabsDisabled] = useState(false)
  const [tab, setTab] = useState(settings.finishedGuideStep < Internal.LastGuideStep
    ? 'settings' : 'savedLogins')

  useEffect(() => {
    setModalOpen(settings.finishedGuideStep < Internal.LastGuideStep)
  }, [settings])

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <div className='extension'>
      <AppBar position='static'>
        <Tabs value={tab} onChange={handleChange}>
          <Tab
            value='settings'
            label={t('settings.name')}
            icon={<SettingsIcon className={classes.icon} />}
            disabled={tabsDisabled}
            classes={{
              wrapper: classes.iconLabelWrapper
            }}
          >
          </Tab>
          <Tab
            value='savedLogins'
            label={t('savedCredentials.name')}
            icon={<VpnKeyIcon className={classes.icon} />}
            disabled={tabsDisabled}
            classes={{
              wrapper: classes.iconLabelWrapper
            }}
          >
          </Tab>
          <Tab
            value='about'
            label={t('about.name')}
            icon={<InfoIcon className={classes.icon} />}
            disabled={tabsDisabled}
            classes={{
              wrapper: classes.iconLabelWrapper
            }}
          >
          </Tab>
          <TabButtonsContainer
            className='tabsAdditionalIcons'
          >
            {
              settings && settings.storageType && <ButtonWithTooltipAndIcon
                tooltipText={t(settings.storageType === 'local' ? 'general.dataInLocalStorage' : 'general.dataInCloud')}
                icon={settings.storageType === 'local' ? <CloudOffIcon /> : <CloudQueueIcon />}
                disabled
              />
            }
            <ButtonWithTooltipAndIcon
              onClick={_ => setModalOpen(true)}
              tooltipText={t('modal.name')}
              icon={<ErrorOutlineIcon />}
              disabled={tabsDisabled}
            />
          </TabButtonsContainer>
        </Tabs>
      </AppBar>
      <TabContent
        id='settings'
        selectedTab={tab}
      >
        <SettingsTab></SettingsTab>
      </TabContent>
      <TabContent
        id='savedLogins'
        selectedTab={tab}
      >
        <CredentialsList></CredentialsList>
      </TabContent>
      <TabContent
        id='about'
        selectedTab={tab}
      >
        <AboutTab />
      </TabContent>
      <GuideModal
        isOpen={modalOpen}
        handleOnClose={_ => setModalOpen(!modalOpen)}
      />
    </div>
  )
}

App.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.any,
  finishedGuideStep: PropTypes.number,
  initialSettings: PropTypes.object
}

export default withTranslation(['common'])(withStyles(styles)(App))
