import React from 'react'
import PropTypes from 'prop-types'

const CustomLink = ({ href, children }) => {
  return <a href={href} rel='noopener noreferrer' target='_blank'>{children}</a>
}

CustomLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  href: PropTypes.string.isRequired
}

export default CustomLink
