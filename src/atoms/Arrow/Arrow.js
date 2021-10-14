/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import './Arrow.css'

export const DIR_RIGHT = true
export const DIR_LEFT = false

export const Arrow = ({ direction, onClick }) => {
  const dir = direction === DIR_RIGHT ? 'right' : 'left'
  return (
    <span
      role="button"
      aria-label={`${dir}-button`}
      tabIndex={0}
      onClick={onClick}
      className={`arrow-button ${dir}-button`}
    >
      <i className={`arrow ${dir}-arrow`}></i>
    </span>
  )
}

Arrow.propTypes = {
  direction: PropTypes.bool,
  onClick: PropTypes.func,
}
