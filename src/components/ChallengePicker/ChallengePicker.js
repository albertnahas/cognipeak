import React, { useEffect, useRef, useState } from 'react'
import './ChallengePicker.css'

import { MemoryBlocks } from '../MemoryBlocks/MemoryBlocks';
import { Sorter } from '../Sorter/Sorter';
import { Approximity } from '../Approximity/Approximity';
import { DotsHunter } from '../DotsHunter/DotsHunter';

export const Games = {
    MemoryBlocks,
    Sorter,
    DotsHunter,
    Approximity,
};

export const ChallengePicker = ({ game, onFinish }) => {

    const [start, setStart] = useState(false)
    const counterRef = useRef(0)
    const [counter, setCounter] = useState(0)

    useEffect(() => {

        const counterInterval = setInterval(() => {
            if (counterRef.current === 3) {
                setStart(true)

            }
            counterRef.current = counterRef.current + 1;
            setCounter(counterRef.current)
        }, 1000);


        return () => {
            clearInterval(counterInterval)
        }
    }, [])

    return (
        <div>
            <h1>{game}</h1>
            {!start && <h1>{counter}</h1>}
            {start && typeof Games[game] !== "undefined" && React.createElement(Games[game], { onFinish })}
        </div>
    )
}
