import React from 'react'
import { useSelector } from 'react-redux'
import './Profile.css'
import { ProfilePhoto } from './ProfilePhoto'

export const Profile = () => {
  const user = useSelector((state) => state.user.value)
  return user ? (
    <>
      <p>{user.displayName}</p>
      <ProfilePhoto />
    </>
  ) : (
    <></>
  )
}
