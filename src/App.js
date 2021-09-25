import './App.css';
import firebase from './config';
import logo from './logo.png'
import Lobby from './components/Lobby/Lobby';
import withFirebaseAuth from 'react-with-firebase-auth';
import { GSignInButton } from './atoms/GSignInButton';
import { useEffect } from 'react';
import { Nav } from './components/Nav/Nav';
import { AuthProvider } from './hooks/auth.context';

const firebaseAppAuth = firebase.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
});

const App = ({
  /** These props are provided by withFirebaseAuth HOC */
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGithub,
  signInWithTwitter,
  signInAnonymously,
  signOut,
  setError,
  user,
  error,
  loading,
}) => {

  useEffect(() => {
    if (user && user.uid) {
      firebase.database().ref('users/' + user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      }).catch((error) => {
        console.error(error);
      })
    }

  }, [user])

  return (
    <AuthProvider user={user}>
      <div className="AppWrapper">
        {loading && <h1>Hello</h1>}
        {!user && <div className="LoginWrapper">
          <img alt="" className="AppLogo" src={logo} />
          <GSignInButton onClick={signInWithGoogle} />
        </div>
        }
        {user && <Nav> <Lobby /></Nav>}
      </div>
    </AuthProvider>
  )
};

export default createComponentWithAuth(App);
