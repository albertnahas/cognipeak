import React from 'react'
import './GSignInButton.css'

export const GSignInButton = ({ onClick }) => {
    return (
        <div onClick={onClick} className='g-sign-in-button'>
            <div className="content-wrapper">
                <div className="logo-wrapper">
                    <img alt="" src="https://developers.google.com/identity/images/g-logo.png" />
                </div>
                <span className="text-container">
                    <span>Continue with Google</span>
                </span>
            </div>
        </div>
    )
}
