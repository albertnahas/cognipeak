/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react'
// import { UserConsumer } from '../../utils/UserContext';
import './Lobby.css'
import firebase from '../../config'
import { useAuth } from '../../hooks/auth.context'
import { ChallengeProvider } from '../../hooks/challenge.context'
import { ChallengePicker, Games } from '../ChallengePicker/ChallengePicker'

const Lobby = () => {
  const { user } = useAuth()

  const [challengeRef, setChallengeRef] = useState(undefined)
  const [challenge, setChallenge] = useState(undefined)
  const [scores, setScores] = useState([])
  const [playing, setPlaying] = useState(false)

  const onClickChallenge = () => {
    const challengesRef = firebase.database().ref('challenges')
    challengesRef
      .orderByChild('player')
      .equalTo(null)
      .once('value')
      .then((snapshot) => {
        const challenges = snapshot.val()
        let created = false
        Object.entries(challenges).forEach((entry) => {
          if (created) return
          const [challengeKey, challengeObj] = entry
          joinChallenge(challengeObj, challengeKey)
          created = true
        })
        if (!created) {
          createChallenge()
        }
      })
  }

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
    newChallenge
      .set(challengeObj)
      .then(() => {
        setChallengeRef(newChallenge)
        setChallenge(challengeObj)
      })
      .catch(() => {})
  }

  const joinChallenge = (challengeObj, key) => {
    const updatedChallenge = {
      ...challengeObj,
      player: user.uid,
      player2: user.displayName,
      status: 'ongoing',
    }
    const fetchedChallenged = firebase.database().ref('challenges').child(key)
    fetchedChallenged.update(updatedChallenge).then(() => {
      setChallengeRef(fetchedChallenged)
      setChallenge(updatedChallenge)
    })
  }

  const isCurrentUserWinner = () =>
    // eslint-disable-next-line eqeqeq
    (scores[0].score > scores[1].score && scores[0].playerId == user.uid) ||
    // eslint-disable-next-line eqeqeq
    (scores[0].score < scores[1].score && scores[1].playerId == user.uid)

  useEffect(() => {
    firebase
      .database()
      .ref('challenges')
      .orderByChild('creator')
      .equalTo(user.uid)
      .once('value')
      .then((snapshot) => {
        const challenges = snapshot.val()
        Object.entries(challenges).forEach((entry) => {
          const [challengeKey, challengeObj] = entry
          if (challengeObj.status === 'pending') {
            setChallengeRef(
              firebase.database().ref(`challenges/${challengeKey}`),
            )
          }
        })
      })

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!challengeRef || !challengeRef.key) {
      return
    }
    firebase
      .database()
      .ref(`challenges/${challengeRef.key}`)
      .on('value', (snapshot) => {
        const updatedChallenge = snapshot.val()
        setChallenge(updatedChallenge)
      })

    firebase
      .database()
      .ref(`challenges/${challengeRef.key}/scores`)
      .on('value', (snapshot) => {
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
      firebase.database().ref(`challenges/${challengeRef.key}`).off()
      firebase.database().ref(`challenges/${challengeRef.key}/scores`).off()
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
    // const isCreator = challenge.creator === user.uid

    // let updatedChallenge = {
    //     done: challenge.done + 1
    // }
    // if (challenge.done === 1) {
    //     updatedChallenge.status = "done"
    // }
    // isCreator ? updatedChallenge.player1Score = score : updatedChallenge.player2Score = score

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

  return (
    <ChallengeProvider challenge={challenge}>
      <div className="Lobby">
        {/* <ChallengePicker game="Unique" onFinish={() => {}} /> */}
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
                {isCurrentUserWinner() && <h1>You won!</h1>}
              </div>
            )}
        </div>
        {challenge && challenge.status === 'ongoing' && challenge.game && (
          <ChallengePicker game={challenge.game} onFinish={onGameFinish} />
        )}
      </div>
    </ChallengeProvider>
  )
}

// const withContext = () => (
//     <UserConsumer>
//         {state => <Lobby context={state} />}
//     </UserConsumer>
// );

export default Lobby
