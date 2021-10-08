import React from 'react'
import PropTypes from 'prop-types'

const AuthContext = React.createContext(null)

export const AuthProvider = ({ user, children }) => (
  <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
)

export const useAuth = () => React.useContext(AuthContext)

AuthProvider.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object,
}
