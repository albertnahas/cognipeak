import React, { useState } from 'react';

const ChallengeContext = React.createContext(null)

export const ChallengeProvider = ({ challenge, children }) => {
    const [currentChallenge, setCurrentChallenge] = useState(challenge)
    return (<ChallengeContext.Provider value={{ currentChallenge, setCurrentChallenge }}>
        {children}
    </ChallengeContext.Provider>)
}

export const useChallenge = () => React.useContext(ChallengeContext)