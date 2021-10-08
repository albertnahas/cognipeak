import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ChallengeContext = React.createContext(null)

export const ChallengeProvider = ({ challenge, children }) => {
  const [currentChallenge, setCurrentChallenge] = useState(challenge)
  return (
    <ChallengeContext.Provider
      value={{ currentChallenge, setCurrentChallenge }}
    >
      {children}
    </ChallengeContext.Provider>
  )
}

ChallengeProvider.propTypes = {
  challenge: PropTypes.object,
  children: PropTypes.object,
}

export const useChallenge = () => React.useContext(ChallengeContext)
