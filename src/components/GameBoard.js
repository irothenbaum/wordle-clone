import './GameBoard.css'
import PropTypes from 'prop-types'
import {useState} from 'react'
import {useEffect} from 'react'
import WordRow from './WordRow'
import Keyboard from './Keyboard'
import {determineGuessResults} from '../lib/utilities'

const NUMBER_OF_GUESSES = 5

function GameBoard(props) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [showGuessResults, setShowGuessResults] = useState(false)
  const [letterStates, setLetterStates] = useState({})

  const handleGuess = () => {
    if (userGuess.length < props.word.length) {
      return
    }

    setShowGuessResults(true)
  }

  useEffect(() => {
    if (!showGuessResults && userGuess) {
      const results = determineGuessResults(userGuess, props.word)
      // TODO: this will just blindly overwrite it. It's possible the user is an idiot and used a previously "correct" letter
      //  in a now less-than-correct spot so this would overwrite the previous "correct" into an "almost"
      //  But ignoring for now
      setLetterStates({
        ...letterStates,
        ...userGuess.split('').reduce((agr, c, index) => {
          agr[c] = results[index]
          return agr
        }, {}),
      })

      setPreviousGuesses([...previousGuesses, userGuess])
      setUserGuess('')
      setShowGuessResults(false)
    }
  }, [showGuessResults])

  return (
    <div className="GameBoard">
      {previousGuesses.map((prevGuess, index) => {
        return <WordRow isRevealed={true} key={`guess-${index}`} word={prevGuess} secretWord={props.word} />
      })}
      {previousGuesses.length < NUMBER_OF_GUESSES && (
        <WordRow
          key={previousGuesses.length}
          showResults={showGuessResults}
          onRevealed={() => setShowGuessResults(false)}
          word={userGuess}
          secretWord={props.word}
        />
      )}
      {[...new Array(NUMBER_OF_GUESSES - previousGuesses.length)].map((empty, index) => {
        return <WordRow key={`empty-${index}`} word={''} secretWord={props.word} />
      })}

      <Keyboard
        value={userGuess}
        onChange={setUserGuess}
        onComplete={handleGuess}
        isFull={userGuess.length === props.word.length}
        isDisabled={showGuessResults}
        letterStates={letterStates}
      />
    </div>
  )
}

GameBoard.propTypes = {
  word: PropTypes.string,
}

export default GameBoard
