/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import './MemoryBlocks.css'
import { getSquareSize } from '../../../utils/Helpers'

const TIMER = 1000
const MAX_TUNRS = 12
const STARTING_LEVEL = 1

export const MemoryBlocks = ({ onFinish }) => {
  const [level, setLevel] = useState(STARTING_LEVEL)
  const [tunrs, setTurns] = useState(0)
  const [activeSqures, setActiveSqaures] = useState([])
  const [clickedSqaures, setClickedSqaures] = useState([])
  const [showActiveSqures, setShowActiveSqaures] = useState(true)
  const [showClickedSquares, setShowClickedSquares] = useState(true)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const getSquaresCount = (lv) => 2 + lv
  const getBoardDimensions = (lv) => 3 + Math.floor(lv / 3)

  const sqauresCount = useMemo(() => getSquaresCount(level), [level])
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])

  const finishTurn = () => {
    checkStatus()
    setTurns((t) => t + 1)
  }
  const checkStatus = () => {
    if (clickedSqaures.sort().every((v, i) => v === activeSqures.sort()[i])) {
      setLevel((preVal) => preVal + 1)
    } else {
      setLevel((preVal) => preVal - 1)
    }
  }

  // const getMaxScore = () => {
  //     let maxScore = 0
  //     for (let i = STARTING_LEVEL; i < MAX_TUNRS; i++) {
  //         maxScore += getSquaresCount(i) * Math.pow(i, 2)
  //     }
  //     return maxScore
  // }

  useEffect(() => {
    if (clickedSqaures.length === sqauresCount) {
      // setShowClickedSquares(false)
      setTimeout(() => setShowClickedSquares(false), 300)
      setTimeout(finishTurn, 600)
    }
  }, [clickedSqaures])

  useEffect(() => {
    if (tunrs === MAX_TUNRS) {
      setFinished(true)
      onFinish(score)
      return
    }

    const squares = []
    while (squares.length < sqauresCount) {
      const r = Math.floor(Math.random() * (boardDimensions * boardDimensions))
      if (squares.indexOf(r) === -1) {
        squares.push(r)
      }
    }
    setActiveSqaures(squares)
    setClickedSqaures([])
    setShowActiveSqaures(true)
    setTimeout(() => {
      setShowActiveSqaures(false)
      setShowClickedSquares(true)
    }, TIMER)
  }, [tunrs])

  const onClickSqaure = (index) => {
    if (
      clickedSqaures.indexOf(index) > -1 ||
      showActiveSqures ||
      clickedSqaures.length === sqauresCount
    ) {
      return
    }
    const newClickedSqaures = [...clickedSqaures, index]
    setClickedSqaures(newClickedSqaures)
    const bonus =
      activeSqures.indexOf(index) > -1
        ? 100 * sqauresCount
        : -1 * 100 * sqauresCount
    setScore((prevScore) => prevScore + bonus)
  }
  const displayLevel = () => {
    let current = -1
    return [...Array(boardDimensions).keys()].map((row) => (
      <div key={row}>
        {[...Array(boardDimensions).keys()].map(() => {
          current += 1
          const isActive =
            (activeSqures.indexOf(current) > -1 && showActiveSqures) ||
            (clickedSqaures.indexOf(current) > -1 && showClickedSquares)
          const isInvalid =
            clickedSqaures.indexOf(current) > -1 &&
            activeSqures.indexOf(current) === -1
          return (
            <Block
              key={current}
              isActive={isActive}
              isInvalid={isInvalid}
              index={current}
              onClickHandler={onClickSqaure}
              size={getSquareSize(boardDimensions)}
            />
          )
        })}
      </div>
    ))
  }

  return (
    <>
      <div className="board MemoryBoard">
        <div className="wrapper">
          {!finished ? displayLevel() : <h1>{score}</h1>}
        </div>
      </div>
    </>
  )
}

export const Block = ({ isActive, isInvalid, index, onClickHandler, size }) => (
  <span
    role="button"
    aria-label="block"
    tabIndex={index}
    key={`${index}`}
    onMouseDown={(e) => onClickHandler(index, e)}
    className={`${
      isActive ? (isInvalid ? `invalid` : `active`) : ``
    } block-${size}`}
  ></span>
)

Block.propTypes = {
  isActive: PropTypes.bool,
  isInvalid: PropTypes.bool,
  index: PropTypes.number,
  onClickHandler: PropTypes.func,
  size: PropTypes.string,
}

MemoryBlocks.propTypes = {
  onFinish: PropTypes.func,
}
