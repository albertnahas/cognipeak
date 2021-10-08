import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import './App.css'
import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from './config'
import logo from './logo.png'
import Lobby from './components/Lobby/Lobby'
import { GSignInButton } from './atoms/GSignInButton'
import { Nav } from './components/Nav/Nav'
import { AuthProvider } from './hooks/auth.context'
import { Header } from './components/Header/Header'

const firebaseAppAuth = firebase.auth()
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
})

const App = ({
  /** These props are provided by withFirebaseAuth HOC */
  // signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  signInWithGoogle,
  // signInWithFacebook,
  // signInWithGithub,
  // signInWithTwitter,
  // signInAnonymously,
  signOut,
  // setError,
  user,
  // error,
  loading,
}) => {
  useEffect(() => {
    if (user && user.uid) {
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .set({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        })
        .catch(() => {})
    }
  }, [user])

  return (
    <AuthProvider user={user}>
      <div className="AppWrapper">
        {loading && <h1>Loading ...</h1>}
        {!user && (
          <div className="LoginWrapper">
            <img alt="" className="AppLogo" src={logo} />
            <GSignInButton onClick={signInWithGoogle} />
          </div>
        )}
        {user && <Header signOut={signOut} />}
        {user && (
          <Nav>
            {' '}
            <Lobby />
          </Nav>
        )}
      </div>
    </AuthProvider>
  )
}

App.propTypes = {
  // signInWithEmailAndPassword: PropTypes.object,
  // createUserWithEmailAndPassword: PropTypes.object,
  signInWithGoogle: PropTypes.func,
  // signInWithFacebook: PropTypes.object,
  // signInWithGithub: PropTypes.object,
  // signInWithTwitter: PropTypes.object,
  // signInAnonymously: PropTypes.object,
  signOut: PropTypes.func,
  // setError: PropTypes.object,
  user: PropTypes.object,
  // error: PropTypes.object,
  loading: PropTypes.bool,
}

export default createComponentWithAuth(App)
