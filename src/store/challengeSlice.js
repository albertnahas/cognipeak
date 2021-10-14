/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = { a: 'bbb' }

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setChallenge: (state, action) => {
      state.challenge = action.payload
    },
    setChallengeRef: (state, action) => {
      state.challengeRef = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChallenge, setChallengeRef } = challengeSlice.actions

export default challengeSlice.reducer
