import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import challengeReducer from './challengeSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    challenge: challengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
