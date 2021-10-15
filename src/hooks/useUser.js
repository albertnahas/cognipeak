import { useSelector } from 'react-redux'
import firebase from '../config'

export const useUser = () => {
  const user = useSelector((state) => state.user.value)

  const createUser = (newUser) => {
    const userObj = {
      uid: newUser.uid,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
      lastLogin: new Date(),
    }
    firebase
      .database()
      .ref(`users/${newUser.uid}`)
      .set(userObj)
      .catch(() => {})

    return { userObj }
  }

  const createUserChallenge = (challenge, game, score) => {
    firebase
      .database()
      .ref(`users/${user.uid}/challenges`)
      .push()
      .set({
        challenge,
        game,
        score,
        finishedAt: firebase.database.ServerValue.TIMESTAMP,
      })
      .catch(() => {})
  }

  return {
    createUser,
    createUserChallenge,
  }
}
