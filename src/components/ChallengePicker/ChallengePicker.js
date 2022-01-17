import React, { useEffect, useRef, useState } from 'react'
import './ChallengePicker.css'
import PropTypes from 'prop-types'

import { MemoryBlocks } from '../games/MemoryBlocks/MemoryBlocks'
import { Sorter } from '../games/Sorter/Sorter'
import { Approximity } from '../games/Approximity/Approximity'
import { DotsHunter } from '../games/DotsHunter/DotsHunter'
import { QuickMath } from '../games/QuickMath/QuickMath'
import { Unique } from '../games/Unique/Unique'
import { Immigration } from '../games/Immigration/Immigration'
import { MemoryPath } from '../games/MemoryPath/MemoryPath'

export const Games = {
  MemoryBlocks,
  Sorter,
  DotsHunter,
  Approximity,
  QuickMath,
  Unique,
  Immigration,
  MemoryPath,
}

export const ChallengePicker = ({ game, onFinish }) => {
  // eslint-disable-next-line no-alert
  const [start, setStart] = useState(false)
  const counterRef = useRef(0)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const counterInterval = setInterval(() => {
      if (counterRef.current === 3) {
        setStart(true)
      }
      counterRef.current += 1
      setCounter(counterRef.current)
    }, 1000)

    return () => {
      clearInterval(counterInterval)
    }
  }, [])

  return (
    <div className="ChallengeBoard">
      {!start && <h1>{game}</h1>}
      {!start && counter < 3 && <h1>{3 - counter}</h1>}
      {start &&
        typeof Games[game] !== 'undefined' &&
        React.createElement(Games[game], { onFinish })}
    </div>
  )
}

ChallengePicker.propTypes = {
  game: PropTypes.string,
  onFinish: PropTypes.func,
}
