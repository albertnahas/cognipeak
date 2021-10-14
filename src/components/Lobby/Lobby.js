/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react'
// import { UserConsumer } from '../../utils/UserContext';
import './Lobby.css'
import { useSelector, useDispatch } from 'react-redux'
import { ChallengePicker } from '../ChallengePicker/ChallengePicker'
import { useChallenge } from '../../hooks/useChallenge'
// import { Profile } from '../Profile/Profile'
// import { useUser } from '../../hooks/useUser'
import { setChallenge, setChallengeRef } from '../../store/challengeSlice'
import {
  getChallengeByKey,
  getChallengesByCreator,
  getChallengeScores,
  getIdleChallenges,
} from '../../utils/Queries'

const Lobby = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const challenge = useSelector((state) => state.challenge.challenge)
  const challengeRef = useSelector((state) => state.challenge.challengeRef)

  const challengeHelper = useChallenge()
  // const userHelper = useUser()

  const [scores, setScores] = useState([])
  const [playing, setPlaying] = useState(false)

  const onClickChallenge = () => {
    getIdleChallenges()
      .once('value')
      .then((snapshot) => {
        const challenges = snapshot.val()
        let created = false
        if (challenges) {
          Object.entries(challenges).forEach((entry) => {
            if (created) return
            const [challengeKey, challengeObj] = entry
            challengeHelper.joinChallenge(challengeObj, challengeKey)
            created = true
          })
        }
        if (!created) {
          challengeHelper.createChallenge()
        }
      })
  }

  const isCurrentUserWinner = () =>
    // eslint-disable-next-line eqeqeq
    (scores[0].score > scores[1].score && scores[0].playerId == user.uid) ||
    // eslint-disable-next-line eqeqeq
    (scores[0].score < scores[1].score && scores[1].playerId == user.uid)

  useEffect(() => {
    if (!user) return
    // rejoin own idle challenge
    getChallengesByCreator(user.uid)
      .once('value')
      .then((snapshot) => {
        const challenges = snapshot.val()
        if (!challenges) return
        Object.entries(challenges).forEach((entry) => {
          const [challengeKey, challengeObj] = entry
          if (challengeObj.status === 'pending') {
            dispatch(setChallengeRef(getChallengeByKey(challengeKey)))
          }
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (!challengeRef || !challengeRef.key) {
      return
    }
    getChallengeByKey(challengeRef.key).on('value', (snapshot) => {
      const updatedChallenge = snapshot.val()
      dispatch(setChallenge(updatedChallenge))
    })

    getChallengeScores(challengeRef.key).on('value', (snapshot) => {
      const scoresArr = []
      const scoresObj = snapshot.val()
      if (!scoresObj) return
      Object.keys(scoresObj).forEach((score) => {
        scoresArr.push(scoresObj[score])
      })
      if (scores.length >= 2 && challenge && challenge.status !== 'done') {
        challengeRef.update({ status: 'done' })
      }
      setScores(scoresArr)
    })
    return () => {
      getChallengeByKey(challengeRef.key).off()
      getChallengeScores(challengeRef.key).off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeRef])

  useEffect(() => {
    if (challenge && challenge.status === 'ongoing') {
      setPlaying(true)
    } else if (playing) {
      setPlaying(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge])

  const onGameFinish = (score) => {
    challengeHelper.submitScore(score)
    // userHelper.createUserChallenge(challengeRef.getKey(), challenge.game, score)
  }

  return (
    <div className="Lobby">
      {/* <ChallengePicker game="Immigration" onFinish={() => {}} /> */}
      {/* <Profile /> */}
      <div
        style={{ height: `${playing ? 'auto' : '100%'}` }}
        className="LobbyWrapper"
      >
        {!challenge && (
          <button
            type="button"
            className="challenge-btn"
            onClick={onClickChallenge}
          >
            Challenge
          </button>
        )}
        {challenge && challenge.status === 'pending' && (
          <p>Waiting for a challenger ...</p>
        )}
        {challenge && challenge.status === 'ongoing' && (
          <p>
            Challenging{' '}
            {challenge.player1 === user.displayName
              ? challenge.player2
              : challenge.player1}
          </p>
        )}
        {challenge &&
          // && challenge.status === 'done'
          scores.length === 2 && (
            <div>
              {scores.map((s) => (
                <h2 key={s.playerId}>
                  {s.player} score is: {s.score}
                </h2>
              ))}
              {user && isCurrentUserWinner() && <h1>You won!</h1>}
            </div>
          )}
      </div>
      {challenge && challenge.status === 'ongoing' && challenge.game && (
        <ChallengePicker game={challenge.game} onFinish={onGameFinish} />
      )}
    </div>
  )
}

export default Lobby
