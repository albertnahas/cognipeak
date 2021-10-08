import { createContext } from 'react'

export const UserContext = createContext({
  user: '',
  updateUser: () => {},
})

export const UserConsumer = UserContext.Consumer
