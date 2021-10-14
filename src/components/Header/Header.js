/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import './Header.css'
import logo from '../../logo.png'
import { ProfilePhoto } from '../Profile/ProfilePhoto'

export const Header = ({ signOut }) => {
  const user = useSelector((state) => state.user.value)

  return (
    (user && (
      <header>
        <div className="logo">
          <img alt="" src={logo} />
        </div>
        <div className="userInfo">
          <ProfilePhoto />
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
