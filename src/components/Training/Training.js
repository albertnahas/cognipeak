/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'
import { Games } from '../ChallengePicker/ChallengePicker'
import './Training.css'

export const Training = ({ onClickGame }) => (
  <div className="TrainingWrapper">
    {Object.keys(Games).map((game, index) => (
      <div
        key={game}
        role="button"
        aria-label="shape"
        tabIndex={0}
        className="button-game"
        onClick={() => {
          onClickGame(index)
        }}
      >
        {game}
      </div>
    ))}
  </div>
)

Training.propTypes = {
  onClickGame: PropTypes.func,
}
