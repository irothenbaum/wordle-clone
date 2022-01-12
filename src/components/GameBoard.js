import PropTypes from 'prop-types'
import {useState} from 'react'
import {useEffect} from 'react'
import LetterSpace from './LetterSpace'
import WordRow from './WordRow'

const NUMBER_OF_GUESSES = 5

function GameBoard(props) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  useEffect(() => {}, [])

  return (
    <div className="GameBoard">
      {previousGuesses.map((prevGuess, index) => {
        return (
          <WordRow
            key={`guess-${index}`}
            word={prevGuess}
            secretWord={props.word}
          />
        )
      })}
      {previousGuesses.length < NUMBER_OF_GUESSES && (
        <WordRow word={userGuess} secretWord={props.word} />
      )}
    </div>
  )
}

GameBoard.propTypes = {
  word: PropTypes.string,
}

export default GameBoard
