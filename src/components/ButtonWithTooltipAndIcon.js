
import React from 'react'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  small: {
    '& svg': {
      // fontSize: 25
    }
  },
  medium: {
    '& svg': {
      fontSize: 37
    }
  },
  deleteIcon3: {
    '& svg': {
      fontSize: 75
    }
  },
  customTooltip: {
    backgroundColor: '#f9f9f9',
    color: 'black'
  }
}))

const ButtonWithTooltipAndIcon = ({ onClick, tooltipText, icon, buttonStyle, disabled, size }) => {
  const classes = useStyles()
  const sizeClass = classes[size] || classes.small
  return (
    <Tooltip classes={{ tooltip: classes.customTooltip }} title={tooltipText}>
      <span style={{ alignSelf: 'center' }}>
        <IconButton
          style={{ ...buttonStyle, padding: '5px' }}
          onClick={onClick}
          disabled={disabled}
          className={sizeClass}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

ButtonWithTooltipAndIcon.propTypes = {
  onClick: PropTypes.func,
  tooltipText: PropTypes.string.isRequired,
  icon: PropTypes.node,
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool,
  size: PropTypes.string
}

export default ButtonWithTooltipAndIcon
