import React from 'react'
import PropTypes from 'prop-types'

const TabButtonsContainer = ({ className, children }) => {
  return (
    <div className={className || ''}>
      {children}
    </div>
  )
}

TabButtonsContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default TabButtonsContainer
