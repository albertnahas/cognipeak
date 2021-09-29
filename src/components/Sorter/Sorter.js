/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { Timer } from '../Timer/Timer'
import './Sorter.css'

// const TIMER = 60
const SHAPES_SPRITE = [2, 2] // 3,4 
const SHAPES_COUNT = SHAPES_SPRITE[0] * SHAPES_SPRITE[1]

const DIR_RIGHT = true
const DIR_LEFT = false
const DIR_NONE = undefined

export const Sorter = ({ onFinish }) => {

    const scoreRef = useRef(0)
    const [score, setScore] = useState(0)
    const [multiplier, setMultiplier] = useState(1)
    // const [level, setLevel] = useState(STARTING_LEVEL)
    const [tunrs, setTurns] = useState(0)
    const [finished, setFinished] = useState(false)

    const [shape, setShape] = useState(0)
    const [prevShape, setPrevShape] = useState(-1)

    const directionRef = useRef(DIR_NONE)
    const [direction, setDirection] = useState(DIR_NONE)
    const [prevDirection, setPrevDirection] = useState(DIR_NONE)

    const genNum = () => Math.floor(Math.random() * (SHAPES_COUNT));
    const genDir = () => Math.random() > 0.5;
    const getShape = (num) => `calc(100% * ${num % SHAPES_SPRITE[0]}) calc(100% * ${Math.floor(num / SHAPES_SPRITE[1])})`;


    const slideShape = (dir) => {
        if (finished) return;
        setPrevDirection(directionRef.current)
        directionRef.current = dir
        setDirection(dir)
        setTimeout(() => {
            setDirection(DIR_NONE)
            setTurns(turn => turn + 1)
        }, 200)
    }

    const onLeftArrowClick = () => {
        slideShape(DIR_LEFT)
    }

    const onRightArrowClick = () => {
        slideShape(DIR_RIGHT)
    }

    const onKeyDown = (e) => {
        const key = e.which;
        if (key === 39) { // the enter key code or right arrow
            onLeftArrowClick()
        } else if (key === 37) { // left arrow
            onRightArrowClick()
        }
    }

    useEffect(() => {
        setShape(genNum())
        setTimeout(() => {
            setDirection(genDir())
        }, 500)
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAnimation = () => {
        switch (direction) {
            case DIR_LEFT: return 'left';
            case DIR_RIGHT: return 'right';
            default: return '';
        }
    }

    useEffect(() => {
        setShape(genNum())
        // debugger;
        if (prevShape !== -1 && prevDirection !== DIR_NONE) {
            const correct = (prevShape === shape && prevDirection === directionRef.current) || (prevShape !== shape && prevDirection !== directionRef.current)
            const bonus = correct ? 100 * multiplier : -200
            setMultiplier(mult => correct ? Math.min(mult, 6) + 1 : 1)
            scoreRef.current = Math.max(scoreRef.current + bonus, 0)
            setScore(scoreRef.current)
        }
        setPrevShape(shape)
    }, [tunrs])

    const finish = () => {
        setFinished(true)
        window.removeEventListener('keydown', onKeyDown)
        onFinish(scoreRef.current)
    }

    return (
        <div className="board">
            {!finished && <Timer endTime={30} onTimerFinish={finish}></Timer>}
            {!finished ? (
                <>
                    <span onClick={onRightArrowClick} className="arrow-button left-button">
                        <i className="arrow left-arrow"></i>
                    </span><span onClick={onLeftArrowClick} className="arrow-button right-button">
                        <i className="arrow right-arrow"></i>
                    </span><div className={`shape ${getAnimation()}`} style={{ backgroundPosition: getShape(shape) }} />
                </>)
                : <h1>Your score: {score}</h1>
            }
        </div>
    )
}
