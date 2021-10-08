/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import './GSignInButton.css'

export const GSignInButton = ({ onClick }) => (
  <div
    role="button"
    aria-label="shape"
    tabIndex={0}
    onClick={onClick}
    className="g-sign-in-button"
  >
    <div className="content-wrapper">
      <div className="logo-wrapper">
        <img
          alt=""
          src="https://developers.google.com/identity/images/g-logo.png"
        />
      </div>
      <span className="text-container">
        <span>Continue with Google</span>
      </span>
    </div>
  </div>
)

GSignInButton.propTypes = {
  onClick: PropTypes.func,
}
