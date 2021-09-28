import React from 'react';

const AuthContext = React.createContext(null)

export const AuthProvider = ({ user, children }) => {
    return (<AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => React.useContext(AuthContext)