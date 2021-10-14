import { useSelector, useDispatch } from 'react-redux'
import { Games } from '../components/ChallengePicker/ChallengePicker'
import firebase from '../config'
import { setChallenge, setChallengeRef } from '../store/challengeSlice'

export const useChallenge = () => {
  const user = useSelector((state) => state.user.value)
  const challengeRef = useSelector((state) => state.challenge.challengeRef)

  const dispatch = useDispatch()

  const createChallenge = () => {
    const challengeIndex = Math.floor(Math.random() * Object.keys(Games).length)
    const game = Object.keys(Games)[challengeIndex]
    const challengeObj = {
      creator: user.uid,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      player1: user.displayName,
      status: 'pending',
      done: 0,
      game,
    }
    const newChallenge = firebase.database().ref('challenges').push()
    newChallenge.set(challengeObj).catch(() => {})
    dispatch(setChallenge(challengeObj))
    dispatch(setChallengeRef(newChallenge))
    return { challengeRef: newChallenge, challenge: challengeObj }
  }

  const joinChallenge = (challengeObj, key) => {
    const updatedChallenge = {
      ...challengeObj,
      player: user.uid,
      player2: user.displayName,
      status: 'ongoing',
    }
    const fetchedChallenged = firebase.database().ref('challenges').child(key)
    fetchedChallenged.update(updatedChallenge)
    dispatch(setChallenge(challengeObj))
    dispatch(setChallengeRef(fetchedChallenged))
    return { challengeRef: fetchedChallenged, challenge: updatedChallenge }
  }

  const submitScore = (score) => {
    const scoreObj = {
      playerId: user.uid,
      player: user.displayName,
      score,
      finishedAt: firebase.database.ServerValue.TIMESTAMP,
    }
    firebase
      .database()
      .ref(`challenges/${challengeRef.key}/scores`)
      .child(user.uid)
      .set(scoreObj)
  }

  return {
    createChallenge,
    joinChallenge,
    submitScore,
  }
}
