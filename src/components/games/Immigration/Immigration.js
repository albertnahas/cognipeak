import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Timer } from '../../../atoms/Timer/Timer'
import './Immigration.css'
import { getSquareSize } from '../../../utils/Helpers'
import { Arrow, DIR_LEFT, DIR_RIGHT } from '../../../atoms/Arrow/Arrow'

const STARTING_LEVEL = 1
const DIRECTIONS_COUNT = 2

export const Immigration = ({ onFinish }) => {
  const [level, setLevel] = useState(STARTING_LEVEL)
  const [tunrs, setTurns] = useState(0)
  const [shapes, setShapes] = useState([])
  const [clickedShape, setClickedShape] = useState({ index: -1, shape: -1 })
  const [showClickedShape, setShowClickedShape] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const scoreRef = useRef(0)
  const shapesRef = useRef([])

  const getBoardDimensions = (lv) => 4 + Math.floor(lv / 4)
  const getShapesCount = (d) => Math.round(Math.sqrt(d))
  const boardDimensions = useMemo(() => getBoardDimensions(level), [level])
  const shapesCount = useMemo(
    () => getShapesCount(boardDimensions * boardDimensions),
    [boardDimensions],
  )
  const genNum = () => Math.floor(Math.random() * DIRECTIONS_COUNT)

  const finishTurn = () => {
    checkStatus()
    setTurns((t) => t + 1)
  }

  const checkStatus = () => {
    if (isImmigration(clickedShape.shape)) {
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

    for (let index = 0; index < shapesCount; index += 1) {
      const lastShape = genNum()
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
    shapesRef.current = boardArr2D
    setShapes(boardArr2D)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tunrs])

  const onClickShape = (shape, index) => {
    setClickedShape({ shape, index })
    setShowClickedShape(true)
    const bonus = isImmigration(shape)
      ? 100 * shapesCount
      : -1 * 100 * shapesCount
    scoreRef.current = Math.max(scoreRef.current + bonus, 0)
    setScore(scoreRef.current)
  }

  const isImmigration = (shape) =>
    shapesRef.current.flatMap((r) => r).filter((s) => s === shape).length >
    shapesRef.current.flatMap((r) => r).filter((s) => s === +!shape).length

  const displayLevel = () => {
    let current = -1
    return shapes.map((row) => (
      <div key={current}>
        {row.map((col) => {
          current += 1
          const isActive =
            clickedShape &&
            (clickedShape.index === current ||
              (clickedShape.shape === col && clickedShape.index === -1)) &&
            showClickedShape
          const isInvalid = isActive && !isImmigration(col)
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

  const onRightArrowClick = () => {
    onClickShape(+DIR_LEFT, -1)
  }

  const onLeftArrowClick = () => {
    onClickShape(+DIR_RIGHT, -1)
  }

  const onKeyDown = (e) => {
    const key = e.which
    if (key === 39) {
      // the enter key code or right arrow
      onLeftArrowClick()
    } else if (key === 37) {
      // left arrow
      onRightArrowClick()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="board ImmigrationBoard">
        <Arrow direction={DIR_LEFT} onClick={onRightArrowClick} />
        <Arrow direction={DIR_RIGHT} onClick={onLeftArrowClick} />
        <div className="wrapper">
          {!finished && <Timer endTime={10} onTimerFinish={finish}></Timer>}
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
  const dir = (-1) ** shape
  return (
    <span
      role="button"
      aria-label="shape"
      tabIndex={index}
      key={`${index}`}
      onMouseDown={(e) => onClickHandler(shape, index, e)}
      style={{
        transform: `scaleX(${dir})`,
        // filter: `hue-rotate(${dir === 1 ? '0deg' : '180deg'})`,
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

Immigration.propTypes = {
  onFinish: PropTypes.func,
}
