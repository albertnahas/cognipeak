import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import './Approximity.css'
import { Timer } from '../../../atoms/Timer/Timer'

const STARTING_LEVEL = 1
const STARTING_DECIMALS = 2
const SLIDER_STEPS = 5
const BASIC_SCORE = 200

export const Approximity = ({ onFinish }) => {
  const scoreRef = useRef(0)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(STARTING_LEVEL)
  const [tunrs, setTurns] = useState(0)
  const [guess, setGuess] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [equation, setEquation] = useState({
    left: 0,
    plus: true,
    right: 0,
    res: 0,
    from: 0,
    to: 0,
  })
  const [finished, setFinished] = useState(false)

  const getLevelDecimals = (lv) =>
    STARTING_DECIMALS + Math.floor(Math.sqrt(lv) - 1)
  const decimals = useMemo(() => getLevelDecimals(level), [level])
  const max = useMemo(() => 10 * level, [level])

  const round = (num, decs) => Math.round(num * 10 ** decs) / 10 ** decs
  const generateNum = () => round(Math.random() * max, decimals)

  useEffect(() => {
    const left = generateNum()
    const right = generateNum()
    const plus = Math.random() > 0.5
    const res = plus ? left + right : left - right
    const base = Math.round(decimals / 2)
    const from = Math.floor(res) - round(Math.random() / 10 ** base, base)
    const to = Math.ceil(res) + round(Math.random() / 10 ** base, base)
    setEquation({ left, plus, right, res, from, to })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tunrs])

  const getMarks = useMemo(
    () => () => {
      const marks = {}
      if (showResult) {
        return { [equation.res]: round(equation.res, decimals) }
      }
      const step = (equation.to - equation.from) / SLIDER_STEPS
      const base = Math.round(decimals / 2)
      for (let i = equation.from; i < equation.to; i += step) {
        const mark = round(i, base)
        marks[i] = mark
      }
      const last = round(equation.to, base)
      marks[last] = last
      return marks
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [equation, showResult],
  )

  const onAfterSliderChange = (value) => {
    setGuess(value)
  }

  const onOkClick = () => {
    setShowResult(true)
    const levelScore = getLevelScore()
    scoreRef.current += levelScore
    setScore(scoreRef.current)
    if (levelScore > 0) setLevel((l) => l + 1)
    setTimeout(nextLevel, 1000)
  }

  const nextLevel = () => {
    setTurns((t) => t + 1)
    setShowResult(false)
  }

  const evaluate = () => {
    const distance = Math.abs(equation.res - guess)
    const ratio = distance / Math.abs(equation.to - equation.from)
    return 1 - ratio
  }

  const getLevelScore = () => {
    const ratio = evaluate()
    return ratio > 0.6 ? Math.round(BASIC_SCORE * decimals * ratio) : 0
  }

  const finish = () => {
    setFinished(true)
    onFinish(scoreRef.current)
  }

  return (
    <div className="board">
      {!finished && <Timer endTime={45} onTimerFinish={finish}></Timer>}
      <div className="ApproximityBoard">
        {!finished ? (
          <div className="wrapper">
            <p>
              {equation.left} {equation.plus ? '+' : '-'} {equation.right}
            </p>
            <div className="sliderWrapper">
              <Slider
                min={equation.from}
                max={equation.to}
                step={1 / 10 ** decimals}
                marks={getMarks()}
                included={false}
                dotStyle={{ borderColor: 'orange' }}
                activeDotStyle={{ borderColor: 'yellow' }}
                onAfterChange={onAfterSliderChange}
                // handle={handle}
              />
            </div>
            {showResult ? (
              <h3>+{getLevelScore()}</h3>
            ) : (
              <button type="button" onClick={onOkClick}>
                Ok!
              </button>
            )}
          </div>
        ) : (
          <h1>Your score: {score}</h1>
        )}
      </div>
    </div>
  )
}
Approximity.propTypes = {
  onFinish: PropTypes.func,
}
