import React from 'react'
import PropTypes from 'prop-types'

const TabContent = (props) => {
  const { children, selectedTab, id, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={selectedTab !== id}
      id={`tab-${id}`}
      aria-labelledby={`tab-${id}`}
      {...other}
    >
      {selectedTab === id && (
        <>
          {children}
        </>
      )}
    </div>
  )
}

TabContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  selectedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default TabContent
