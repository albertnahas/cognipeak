import { useSelector, useDispatch } from 'react-redux'
import { Games } from '../components/ChallengePicker/ChallengePicker'
import firebase from '../config'
import { setChallenge, setChallengeRef } from '../store/challengeSlice'

export const useChallenge = () => {
  const user = useSelector((state) => state.user.value)
  const challengeRef = useSelector((state) => state.challenge.challengeRef)
  const challenge = useSelector((state) => state.challenge.challenge)

  const dispatch = useDispatch()

  const createChallenge = (type = 'multi', index) => {
    const challengeIndex =
      index !== undefined
        ? index
        : Math.floor(Math.random() * Object.keys(Games).length)
    const game = Object.keys(Games)[challengeIndex]
    const challengeObj = {
      creator: user.uid,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      player1: user.displayName,
      status: type === 'multi' ? 'pending' : 'ongoing',
      type,
      game,
    }
    if (type === 'multi') {
      const newChallenge = firebase.database().ref('challenges').push()
      newChallenge.set(challengeObj)
      dispatch(setChallengeRef(newChallenge))
    }
    dispatch(setChallenge(challengeObj))
  }

  const updateChallenge = (updated) => {
    dispatch(setChallenge({ ...challenge, ...updated }))
  }

  const clearChallenge = () => {
    dispatch(setChallenge(null))
    dispatch(setChallengeRef(null))
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

  const deleteChallenge = (key) => {
    firebase.database().ref('challenges').child(key).remove()
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
    updateChallenge,
    clearChallenge,
    deleteChallenge,
  }
}
