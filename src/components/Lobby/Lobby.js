import React, { useEffect, useState } from 'react'
// import { UserConsumer } from '../../utils/UserContext';
import './Lobby.css'
import firebase from '../../config'
import { useAuth } from '../../hooks/auth.context';
import { ChallengeProvider } from '../../hooks/challenge.context';
import { ChallengePicker, Games } from '../ChallengePicker/ChallengePicker';

const Lobby = () => {
    const user = useAuth().currentUser

    const [challengeRef, setChallengeRef] = useState(undefined)
    const [challenge, setChallenge] = useState(undefined)

    const onClickChallenge = () => {
        const challengesRef = firebase.database().ref('challenges')
        challengesRef.orderByChild('player')
            .equalTo(null)
            .once("value")
            .then((snapshot) => {
                const challenges = snapshot.val()
                let created = false
                for (const challengeKey in challenges) {
                    // if (challenges[challenge].creator === user.uid)
                    //     continue;
                    joinChallenge(challenges[challengeKey], challengeKey)
                    console.log('found...')
                    created = true
                    break
                }
                if (!created) {
                    createChallenge()
                    console.log('created...')
                }
            })
    }

    const createChallenge = () => {
        const challengeIndex = Math.floor(Math.random() * Object.keys(Games).length);
        const game = Object.keys(Games)[challengeIndex]
        const challengeObj = {
            creator: user.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            player1: user.displayName,
            status: 'pending',  
            done: 0,
            game: game,
        }
        const newChallenge = firebase.database().ref('challenges').push()
        newChallenge.set(challengeObj).then(() => {
            setChallengeRef(newChallenge)
            setChallenge(challengeObj)
        }).catch((error) => {
            console.error(error);
        })
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

    useEffect(() => {
        if (!challengeRef || !challengeRef.key) {
            return
        }
        firebase.database().ref('challenges/' + challengeRef.key).on('value', (snapshot) => {
            setChallenge(snapshot.val())
        })
        return () => {
            firebase.database().ref('challenges').child(challengeRef.key).off()
        }
    }, [challengeRef])

    const onGameFinish = (score) => {
        const isCreator = challenge.creator === user.uid

        let updatedChallenge = {
            done: challenge.done + 1
        }
        if (challenge.done === 1) {
            updatedChallenge.status = "done"
        }
        isCreator ? updatedChallenge.player1Score = score : updatedChallenge.player2Score = score

        const fetchedChallenged = firebase.database().ref('challenges').child(challengeRef.key)
        fetchedChallenged.update(updatedChallenge)
    }

    return (
        <ChallengeProvider challenge={challenge}>
            {
                <div className="Lobby">
                    <p>Welcome {user && user.displayName}</p>
                    {!challenge && <button onClick={onClickChallenge}>Challenge</button>}
                    {challenge && challenge.status === 'pending' &&
                        <p>Waiting for a challenger ...</p>
                    }
                    {challenge && challenge.status === 'ongoing' &&
                        <p>Challenging {challenge.player1 === user.displayName ? challenge.player2 : challenge.player1}</p>
                    }
                    {challenge && challenge.status === 'ongoing' && challenge.game &&
                        <ChallengePicker game={challenge.game} onFinish={onGameFinish} />
                    }
                    {challenge && challenge.status === 'done' &&
                        <div>
                            <h1>{challenge.player1} score is: {challenge.player1Score}</h1>
                            <h1>{challenge.player2} score is: {challenge.player2Score}</h1>
                        </div>
                    }
                </div>
            }
        </ChallengeProvider>
    )
}

// const withContext = () => (
//     <UserConsumer>
//         {state => <Lobby context={state} />}
//     </UserConsumer>
// );

export default Lobby;
