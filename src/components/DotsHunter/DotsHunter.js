/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import './DotsHunter.css'

const STARTING_TIMER = 900
const MAX_TUNRS = 10
const STARTING_LEVEL = 10

export const DotsHunter = ({ onFinish }) => {

    const [level, setLevel] = useState(STARTING_LEVEL)
    const [tunrs, setTunrns] = useState(0)
    const [activeSqure, setActiveSqaure] = useState(-1)
    const [clickedSqaure, setClickedSqaure] = useState(-1)
    const [showActiveSquare, setShowActiveSqaure] = useState(true)
    const [showClickedSquare, setShowClickedSquare] = useState(true)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const flashes = useRef(0)

    const getSquaresCount = (lv) => 2 + lv
    const getBoardDimensions = (lv) => 3 + Math.floor(lv / 3)

    const sqauresCount = useMemo(() => getSquaresCount(level), [level])
    const boardDimensions = useMemo(() => getBoardDimensions(level), [level])

    const finishTurn = () => {
        checkStatus()
        flashes.current = 0;
        setShowClickedSquare(false)
        setClickedSqaure(-1)
        setTimeout(() => setTunrns(tunrs => tunrs + 1), 300)
        debugger
    }
    const checkStatus = () => {
        if (clickedSqaure === activeSqure) {
            setLevel(preVal => {
                return preVal + 1
            })
        } else {
            setLevel(preVal => {
                return preVal - 1
            })
        }
    }

    useEffect(() => {
        if (clickedSqaure === -1) return
        setTimeout(() => setShowClickedSquare(false), 300)
        setTimeout(finishTurn, 600)
    }, [clickedSqaure])

    useEffect(() => {
        if (tunrs === MAX_TUNRS) {
            setFinished(true)
            onFinish(score)
            return
        }

        const flashesInterval = setInterval(() => {
            console.log(flashes.current)
            if (flashes.current >= sqauresCount) {
                setShowActiveSqaure(false)
                setShowClickedSquare(true)
                clearInterval(flashesInterval)
                return;
            }
            const r = Math.floor(Math.random() * (boardDimensions * boardDimensions));
            setActiveSqaure(r)
            flashes.current++;
        }, STARTING_TIMER / level)

        setShowActiveSqaure(true)

        return () => {
            clearInterval(flashesInterval)
        }

    }, [tunrs])

    const getSquareSize = () => {
        switch (true) {
            case (boardDimensions < 4):
                return 'l'
            case (boardDimensions < 6):
                return 'm'
            case (boardDimensions < 8):
                return 's'
            default:
                return 'xs'
        }
    }

    const onClickSqaure = (index, e) => {
        if (showActiveSquare) {
            return
        }
        setClickedSqaure(index)
        const bonus = activeSqure === index ? (level * level * 10) : 0
        setScore(prevScore => prevScore + bonus)
    }
    const displayLevel = () => {
        let current = -1
        return [...Array(boardDimensions).keys()].map((row) => {
            return (
                <div key={row}>
                    {[...Array(boardDimensions).keys()].map((col) => {
                        current++;
                        const isActive = ((activeSqure === current && showActiveSquare) || (clickedSqaure === current && showClickedSquare));
                        const isInvalid = (clickedSqaure === current && activeSqure !== current);
                        return <Block key={current} isActive={isActive} isInvalid={isInvalid} index={current} onClickHandler={onClickSqaure} size={getSquareSize()} />
                    })}
                </div>)
        })
    }

    return (
        <>
            <div className="board MemoryBoard">
                <div className="wrapper">
                    {!finished ? displayLevel() : (<h1>{score}</h1>)}
                </div>
            </div>
        </>
    )
}

export const Block = ({ isActive, isInvalid, index, onClickHandler, size }) => {
    return (
        <span key={`${index}`} onMouseDown={(e) => onClickHandler(index, e)}
            className={`${isActive ? (isInvalid ? `invalid` : `active`) : ``} block-${size}`}></span>
    )
}

