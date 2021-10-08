import React, { useEffect, useRef, useState } from 'react'
import './ChallengePicker.css'
import PropTypes from 'prop-types'

import { MemoryBlocks } from '../MemoryBlocks/MemoryBlocks'
import { Sorter } from '../Sorter/Sorter'
import { Approximity } from '../Approximity/Approximity'
import { DotsHunter } from '../DotsHunter/DotsHunter'
import { QuickMath } from '../QuickMath/QuickMath'
import { Unique } from '../Unique/Unique'

export const Games = {
  MemoryBlocks,
  Sorter,
  DotsHunter,
  Approximity,
  QuickMath,
  Unique,
}

export const ChallengePicker = ({ game, onFinish }) => {
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
      {!start && <h1>{3 - counter}</h1>}
      {start &&
        typeof Games[game] !== 'undefined' &&
        React.createElement(Games[game], { onFinish })}
    </div>
  )
}

ChallengePicker.propTypes = {
  game: PropTypes.object,
  onFinish: PropTypes.func,
}
