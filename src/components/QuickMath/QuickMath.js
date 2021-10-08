/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import 'rc-slider/assets/index.css'
import './QuickMath.css'
import { Timer } from '../Timer/Timer'
import { Numpad } from './Numpad'

const STARTING_LEVEL = 1
const STARTING_DIGITS = 1
const BASIC_SCORE = 200

export const QuickMath = ({ onFinish }) => {
  const guessRef = useRef('')
  const [guess, setGuess] = useState('')
  const scoreRef = useRef(0)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(STARTING_LEVEL)
  const [tunrs, setTurns] = useState(0)
  const equationResRef = useRef(0)
  const [equation, setEquation] = useState({
    left: 0,
    plus: true,
    right: 0,
    res: 0,
  })
  const [finished, setFinished] = useState(false)

  const getLevelDigits = (lv) => STARTING_DIGITS + Math.floor(Math.sqrt(lv) - 1)
  const digits = useMemo(() => getLevelDigits(level), [level])
  const max = useMemo(() => 10 * level, [level])

  const generateNum = () => Math.round(Math.random() * max)

  useEffect(() => {
    const left = generateNum()
    const right = generateNum()
    const plus = Math.random() > 0.5
    const res = plus ? left + right : left - right
    setEquation({ left, plus, right, res })
    equationResRef.current = res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tunrs])

  const onOkClickEnter = () => {
    if (!guessRef.current) return
    const levelScore = getLevelScore()
    scoreRef.current += levelScore
    setScore(scoreRef.current)
    if (levelScore > 0) setLevel((l) => l + 1)
    setTimeout(nextLevel, 200)
  }

  const nextLevel = () => {
    setTurns((t) => t + 1)
    setGuess('')
    guessRef.current = ''
  }

  const setGuessVal = (val) => {
    typeof val === 'function'
      ? (guessRef.current = val(guessRef.current))
      : (guessRef.current = val)
    setGuess(val)
  }

  const getLevelScore = () =>
    // eslint-disable-next-line eqeqeq
    parseInt(guessRef.current, 10) == equationResRef.current
      ? BASIC_SCORE * digits
      : 0

  const finish = () => {
    setFinished(true)
    onFinish && onFinish(scoreRef.current)
  }

  return (
    <div className="board">
      {!finished && <Timer endTime={45} onTimerFinish={finish}></Timer>}
      <div className="MathBoard">
        {!finished ? (
          <div className="wrapper">
            <p className="equation">
              {equation.left} {equation.plus ? '+' : '-'} {equation.right} ={' '}
              {guess || ''}
            </p>
            <Numpad onOkClickEnter={onOkClickEnter} setNumber={setGuessVal} />
          </div>
        ) : (
          <h1>Your score: {score}</h1>
        )}
        {!finished && <h3>score: {score}</h3>}
      </div>
    </div>
  )
}

QuickMath.propTypes = {
  onFinish: PropTypes.func,
}
