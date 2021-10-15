import firebase from '../config'

export const getChallengesByCreator = (id) =>
  firebase.database().ref('challenges').orderByChild('creator').equalTo(id)

export const getIdleChallenges = () =>
  firebase.database().ref('challenges').orderByChild('player').equalTo(null)

export const getChallengeByKey = (key) =>
  firebase.database().ref(`challenges/${key}`)

export const getUserByKey = (key) => firebase.database().ref(`users/${key}`)

export const getChallengeScores = (key) =>
  firebase.database().ref(`challenges/${key}/scores`)
