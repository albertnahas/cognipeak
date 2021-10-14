import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Timer } from '../../../atoms/Timer/Timer'
import './Unique.css'
import { getSquareSize } from '../../../utils/Helpers'

const STARTING_LEVEL = 1
const SHAPES_SPRITE = [4, 4] // 3,4
const SHAPES_COUNT = SHAPES_SPRITE[0] * SHAPES_SPRITE[1]

export const Unique = ({ onFinish }) => {
  const [level, setLevel] = useState(STARTING_LEVEL)
  const [tunrs, setTurns] = useState(0)
  const [shapes, setShapes] = useState([])
  const [clickedShape, setClickedShape] = useState({ index: -1, shape: -1 })
  const [showClickedShape, setShowClickedShape] = useState(true)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const scoreRef = useRef(0)

  const getBoardDimensions = (lv) => 4 + Math.floor(lv / 4)
  const getShapesCount = (d) => Math.round(Math.sqrt(d))
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])
  const shapesCount = useMemo(
    () => getShapesCount(boardDimensions * boardDimensions),
    [boardDimensions],
  )
  const genNum = () => Math.floor(Math.random() * SHAPES_COUNT)

  const finishTurn = () => {
    checkStatus()
    setTurns((t) => t + 1)
  }

  const checkStatus = () => {
    if (isUnique(clickedShape.shape)) {
      setLevel((preVal) => preVal + 1)
    } else {
      setLevel((preVal) => Math.max(preVal - 1, STARTING_LEVEL))
    }
  }

  const finish = () => {
    setFinished(true)
    onFinish(scoreRef.current)
  }

  useEffect(() => {
    if (!clickedShape || clickedShape.shape === -1) return
    setTimeout(() => setShowClickedShape(false), 300)
    setTimeout(finishTurn, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedShape])

  useEffect(() => {
    const squares = []
    const uniqueSquare = genNum()
    squares.push(uniqueSquare)
    for (let index = 1; index < shapesCount; index += 1) {
      let lastShape = genNum()
      while (lastShape === uniqueSquare) {
        lastShape = genNum()
      }
      for (let s = 0; s < index + 1; s += 1) {
        squares.push(lastShape)
      }
    }
    const boardArr = []
    for (let i = 0; i < boardDimensions * boardDimensions; i += 1) {
      if (i < squares.length) {
        boardArr[i] = squares[i]
      } else {
        boardArr[i] = -1
      }
    }
    boardArr.sort(() => 0.5 - Math.random())

    const boardArr2D = []
    for (let i = 0; i < boardDimensions; i += 1) {
      boardArr2D[i] = new Array(boardDimensions)
      for (let j = 0; j < boardDimensions; j += 1) {
        const index = boardDimensions * i + j
        boardArr2D[i][j] = boardArr[index]
      }
    }
    setShapes(boardArr2D)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tunrs])

  const onClickShape = (shape, index) => {
    setClickedShape({ shape, index })
    setShowClickedShape(true)
    const bonus = isUnique(shape) ? 100 * shapesCount : -1 * 100 * shapesCount
    scoreRef.current = Math.max(scoreRef.current + bonus, 0)
    setScore(scoreRef.current)
  }

  const isUnique = (shape) =>
    shapes.flatMap((r) => r).filter((s) => s === shape).length === 1

  const displayLevel = () => {
    let current = -1
    return shapes.map((row) => (
      <div key={current}>
        {row.map((col) => {
          current += 1
          const isActive =
            clickedShape && clickedShape.index === current && showClickedShape
          const isInvalid =
            clickedShape &&
            clickedShape.index === current &&
            !isUnique(col) &&
            showClickedShape
          return (
            <Block
              shape={col}
              key={current}
              isActive={isActive}
              isInvalid={isInvalid}
              index={current}
              onClickHandler={onClickShape}
              size={getSquareSize(boardDimensions)}
            />
          )
        })}
      </div>
    ))
  }

  return (
    <>
      <div className="board UniqueBoard">
        <div className="wrapper">
          {!finished && <Timer endTime={30} onTimerFinish={finish}></Timer>}
          {!finished && shapes.length ? displayLevel() : <h1>{score}</h1>}
        </div>
      </div>
    </>
  )
}

export const Block = ({
  shape,
  isActive,
  isInvalid,
  index,
  onClickHandler,
  size,
}) => {
  const getShape = (num) =>
    `calc(100% * ${num % SHAPES_SPRITE[0]}) calc(100% * ${Math.floor(
      num / SHAPES_SPRITE[1],
    )})`

  return (
    <span
      role="button"
      aria-label="shape"
      tabIndex={index}
      key={`${index}`}
      onMouseDown={(e) => onClickHandler(shape, index, e)}
      style={{
        backgroundPosition: getShape(shape),
        backgroundImage: shape === -1 ? 'none' : '',
      }}
      className={`${
        // eslint-disable-next-line no-nested-ternary
        isActive ? (isInvalid ? `invalid` : `active`) : ``
      } block block-${size} `}
    ></span>
  )
}

Block.propTypes = {
  shape: PropTypes.number,
  isActive: PropTypes.bool,
  isInvalid: PropTypes.bool,
  index: PropTypes.number,
  onClickHandler: PropTypes.func,
  size: PropTypes.string,
}

Unique.propTypes = {
  onFinish: PropTypes.func,
}
