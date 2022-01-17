import './WordRow.css'
import PropTypes from 'prop-types'
import LetterSpace from './LetterSpace'
import {useEffect, useState} from 'react'
import {determineGuessResults} from '../lib/utilities'
import useRevealLetters from '../hooks/useRevealLetters'

function WordRow(props) {
  const {revealPosition, animate} = useRevealLetters(props.word.length)

  const [wordResults, setWordResults] = useState(null)

  useEffect(() => {
    setWordResults(determineGuessResults(props.word, props.secretWord))

    if (!props.isRevealed && props.showResults) {
      animate(props.onRevealed)
    }
  }, [props.showResults, props.isRevealed])

  return (
    <div className={`WordRow ${props.isRevealed ? 'revealed' : ''}`}>
      {props.secretWord.split('').map((letter, index) => {
        let guessedLetter = props.word[index]
        let status = LetterSpace.STATUS_NULL
        if ((props.isRevealed && wordResults) || (props.showResults && revealPosition >= index)) {
          status = wordResults[index]
        }

        return (
          <LetterSpace
            isFlipped={status !== LetterSpace.STATUS_NULL}
            key={`${letter}-${index}`}
            letter={guessedLetter}
            status={status}
            isShaking={props.isShaking}
          />
        )
      })}
    </div>
  )
}

WordRow.propTypes = {
  word: PropTypes.string,
  secretWord: PropTypes.string,
  showResults: PropTypes.bool,
  isRevealed: PropTypes.bool,
  onRevealed: PropTypes.func,
  isShaking: PropTypes.bool,
}

export default WordRow
