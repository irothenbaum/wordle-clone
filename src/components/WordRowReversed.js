import './WordRow.css'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import LetterSpace from './LetterSpace'
import useRevealLetters from '../hooks/useRevealLetters'

function WordRowReversed(props) {
  const {revealPosition, animate} = useRevealLetters(props.word.length)

  useEffect(() => {
    if (props.points && props.showResults) {
      animate(props.onRevealed)
    }
  }, [props.showResults, props.points])

  return (
    <div className={`WordRow ${props.isFocused ? 'focused' : ''}`}>
      {Object.values(props.statusPattern).map((status, index) => {
        let guessedLetter = props.word.charAt(index) || ''

        return (
          <LetterSpace
            key={`${guessedLetter}-${index}`}
            letter={guessedLetter}
            status={status}
            isFlipped={index >= revealPosition}
            points={props.points && revealPosition >= index ? props.points[index] : null}
          />
        )
      })}
    </div>
  )
}

WordRowReversed.propTypes = {
  word: PropTypes.string,
  statusPattern: PropTypes.array,
  isFocused: PropTypes.bool,
  points: PropTypes.array,
  showResults: PropTypes.bool,
  onRevealed: PropTypes.func,
}

export default WordRowReversed
