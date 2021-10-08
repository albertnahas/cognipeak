/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

export const Numpad = ({ setNumber, onOkClickEnter }) => {
  const onNumberClick = (num) => {
    setNumber((number) => number + num.toString())
  }
  const onMinusClick = () => {
    setNumber((number) => {
      if (number === '-') {
        return ''
      }
      if (number.length > 0) {
        return (parseInt(number, 10) * -1).toString()
      }
      return `-${number}`
    })
  }

  const onBackspaceClick = () => {
    setNumber((number) => {
      if (number.toString().length <= 1 || number === '-') return ''
      return number.substr(0, number.toString().length - 1)
    })
  }

  const onKeyDown = (e) => {
    const key = e.which
    if (key >= 48 && key <= 57) {
      // the enter key code or right arrow
      onNumberClick(key - 48)
    } else if (key === 13) {
      // Enter
      onOkClickEnter()
    } else if (key === 109 || key === 189) {
      // Minus
      onMinusClick()
    } else if (key === 8) {
      // Backspace
      onBackspaceClick()
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
    <div className="Numpad">
      {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((n) => (
        <span
          key={n}
          role="button"
          aria-label="right-button"
          tabIndex={0}
          onClick={() => {
            onNumberClick(n)
          }}
        >
          {n}
        </span>
      ))}
      <span
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onMinusClick}
        className="minus"
      >
        -
      </span>
      <span
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onBackspaceClick}
        className="backspace"
      >
        {'<-'}
      </span>
      <span
        role="button"
        aria-label="right-button"
        tabIndex={0}
        onClick={onOkClickEnter}
        className="enter"
      >
        Enter
      </span>
    </div>
  )
}

Numpad.propTypes = {
  setNumber: PropTypes.number,
  onOkClickEnter: PropTypes.func,
}
