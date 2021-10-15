/* eslint-disable no-debugger */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import './App.css'
import withFirebaseAuth from 'react-with-firebase-auth'
import { useDispatch } from 'react-redux'
import firebase from './config'
import logo from './logo.png'
import Lobby from './components/Lobby/Lobby'
import { GSignInButton } from './atoms/GSignInButton/GSignInButton'
import { Nav } from './components/Nav/Nav'
import { Header } from './components/Header/Header'
import { setUser } from './store/userSlice'
import { useUser } from './hooks/useUser'
import { getUserByKey } from './utils/Queries'

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
  const dispatch = useDispatch()
  const userData = useUser()
  useEffect(() => {
    if (user && user.uid) {
      dispatch(setUser(user))
      getUserByKey(user.uid)
        .once('value')
        .then((snapshot) => {
          if (!snapshot.val()) {
            userData.createUser(user)
          }
        })
    }
  }, [user])

  return (
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
