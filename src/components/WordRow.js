import './WordRow.css'
import PropTypes from 'prop-types'
import LetterSpace from './LetterSpace'
import {useEffect, useState} from 'react'
import {determineGuessResults} from '../lib/utilities'

function WordRow(props) {
  const [revealResults, setRevealResults] = useState([])
  const [wordResults, setWordResults] = useState(null)

  useEffect(() => {
    setWordResults(determineGuessResults(props.word, props.secretWord))
  }, [props.showResults, props.isRevealed])

  useEffect(() => {
    if (props.isRevealed) {
      return
    }

    if (revealResults.length < props.word.length) {
      setTimeout(() => {
        setRevealResults(wordResults.slice(0, revealResults.length + 1))
      }, 500)
    } else if (typeof props.onRevealed === 'function') {
      setTimeout(() => {
        props.onRevealed()
      }, 500)
    }
  }, [revealResults, wordResults])

  return (
    <div className={`WordRow ${props.isRevealed ? 'revealed' : ''}`}>
      {props.secretWord.split('').map((letter, index) => {
        let guessedLetter = props.word[index]
        let status = LetterSpace.STATUS_NULL
        if (props.isRevealed && wordResults) {
          status = wordResults[index]
        } else if (props.showResults && revealResults.length > index) {
          status = revealResults[index]
        }

        return <LetterSpace key={`${letter}-${index}`} letter={guessedLetter} status={status} />
      })}
    </div>
  )
}

WordRow.STATUS_BUILD = 'build'
WordRow.STATUS_REVEAL = 'reveal'

WordRow.propTypes = {
  word: PropTypes.string,
  secretWord: PropTypes.string,
  showResults: PropTypes.bool,
  isRevealed: PropTypes.bool,
  onRevealed: PropTypes.func,
}

export default WordRow
