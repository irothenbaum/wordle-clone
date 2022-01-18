import './GameRegular.css'
import PropTypes from 'prop-types'
import {useState} from 'react'
import {useEffect} from 'react'
import WordRow from './WordRow'
import Keyboard from './Keyboard'
import {getWordOfLength} from '../lib/utilities'
import {SCENE_MENU, BOARD_ROWS} from '../lib/constants'
import GameOverResults from './GameOverResults'
import useQuickRevertBoolean from '../hooks/useQuickRevertBoolean'
import useKeyboardLetterStates from '../hooks/useKeyboardLetterStates'

function GameRegular(props) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [showGuessResults, setShowGuessResults] = useState(false)
  const [gameOver, setGameOver] = useState(null)
  const [secretWord, setSecretWord] = useState('')
  const {letterStates, applyGuess} = useKeyboardLetterStates()

  // TODO: when should we shake the input?
  const {status: shouldShake, toggleOn: setShouldShake} = useQuickRevertBoolean()

  const handleGuess = () => {
    if (userGuess.length < secretWord.length) {
      return
    }

    setShowGuessResults(true)
  }

  useEffect(() => {
    const word = getWordOfLength(props.wordLength)
    setSecretWord(word)
    return () => {
      // do nothing
    }
  }, [])

  useEffect(() => {
    let lastGuess = previousGuesses[previousGuesses.length - 1]
    if (lastGuess === secretWord) {
      setGameOver(true)
    } else if (previousGuesses.length === BOARD_ROWS) {
      setGameOver(false)
    } else {
      // do nothing
    }
  }, [previousGuesses])

  const handleRevealGuessComplete = () => {
    setShowGuessResults(false)
    applyGuess(userGuess, secretWord)
    setPreviousGuesses([...previousGuesses, userGuess])
    setUserGuess('')
  }

  if (!secretWord) {
    return null
  }

  const rowsRemaining = BOARD_ROWS - previousGuesses.length - 1

  return (
    <div className="GameRegular">
      {previousGuesses.map((prevGuess, index) => {
        return <WordRow isRevealed={true} key={`guess-${index}`} word={prevGuess} secretWord={secretWord} />
      })}
      {previousGuesses.length < BOARD_ROWS && (
        <WordRow
          key={previousGuesses.length}
          showResults={showGuessResults}
          onRevealed={handleRevealGuessComplete}
          word={userGuess}
          secretWord={secretWord}
        />
      )}
      {rowsRemaining > 0 &&
        [...new Array(rowsRemaining)].map((empty, index) => {
          return <WordRow key={`empty-${index}`} word={''} secretWord={secretWord} />
        })}

      <Keyboard
        value={userGuess}
        onChange={setUserGuess}
        onComplete={handleGuess}
        isFull={userGuess.length === secretWord.length}
        isDisabled={showGuessResults}
        letterStates={letterStates}
      />

      {typeof gameOver === 'boolean' ? (
        <GameOverResults
          secretWord={secretWord}
          didWin={gameOver}
          guessesMade={previousGuesses.length}
          possibleGuesses={BOARD_ROWS}
          onBack={() => props.goToScene(SCENE_MENU)}
        />
      ) : null}
    </div>
  )
}

GameRegular.propTypes = {
  wordLength: PropTypes.number,
  goToScene: PropTypes.func,
}

export default GameRegular
