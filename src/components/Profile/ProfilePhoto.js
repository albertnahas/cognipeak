import React from 'react'
import { useSelector } from 'react-redux'

export const ProfilePhoto = () => {
  const user = useSelector((state) => state.user.value)
  return (
    <span className="profile">
      <span className="profile-wrapper">
        <img alt={user.displayName} src={user.photoURL} />
      </span>
    </span>
  )
}
