/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/auth.context'
import './Header.css'
import logo from '../../logo.png'

export const Header = ({ signOut }) => {
  const { user } = useAuth()

  return (
    (user && (
      <header>
        <div className="logo">
          <img alt="" src={logo} />
        </div>
        <div className="userInfo">
          <span className="profile">
            <span className="profile-wrapper">
              <img alt={user.displayName} src={user.photoURL} />
            </span>
          </span>
          <span className="info">
            {user && user.displayName} |
            <span
              role="button"
              aria-label="signOut"
              tabIndex={0}
              onClick={signOut}
              className="signOut"
            >
              Sign out
            </span>
          </span>
        </div>
      </header>
    )) || <div></div>
  )
}

Header.propTypes = {
  signOut: PropTypes.func,
}
