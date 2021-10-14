import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

export const Timer = ({ endTime, onTimerFinish }) => {
  const time = useRef(0)
  const [timeRef, setTimeRef] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (time.current >= endTime) {
        clearInterval(timer)
        onTimerFinish()
      } else {
        time.current += 1
        setTimeRef(time.current)
      }
    }, 1000)

    return () => {
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const displayTime = () =>
    new Date((endTime - timeRef) * 1000).toISOString().substr(14, 5)

  return <span className="timer"> {displayTime()} </span>
}

Timer.propTypes = {
  endTime: PropTypes.number,
  onTimerFinish: PropTypes.func,
}
