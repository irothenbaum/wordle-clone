import './GameRegular.css'
import PropTypes from 'prop-types'
import {useCallback, useState} from 'react'
import {useEffect} from 'react'
import WordRow from './WordRow'
import Keyboard from './Keyboard'
import {determineGuessResults, getWordOfLength} from '../lib/utilities'
import {ALMOST, CORRECT, WRONG, SCENE_MENU, BOARD_ROWS} from '../lib/constants'
import GameOverResults from './GameOverResults'
import useQuickRevertBoolean from '../hooks/useQuickRevertBoolean'

function GameRegular(props) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [showGuessResults, setShowGuessResults] = useState(false)
  const [letterStates, setLetterStates] = useState({})
  const [gameOver, setGameOver] = useState(null)
  const [secretWord, setSecretWord] = useState('')

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
    console.log(word)
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
    // in this case, we need to feed the results into the keyboard state
    const results = determineGuessResults(userGuess, secretWord)
    setLetterStates({
      ...letterStates,
      ...userGuess.split('').reduce((agr, c, index) => {
        // letterStates will always hold the best guess result for every character
        // the best status could come from 3 possible values:
        // 1. The best status from a previous guess (letterStates)
        // 2. This current character's status in this guess (results)
        // 3. A previous letter of the same character in this guess's status (agr)
        let possibleStatuses = [letterStates[c], results[index], agr[c]]

        // if any are Correct, then the best status is Correct. Otherwise, if any are Almost, then the best status is Almost
        if (possibleStatuses.includes(CORRECT)) {
          agr[c] = CORRECT
        } else if (possibleStatuses.includes(ALMOST)) {
          agr[c] = ALMOST
        } else {
          agr[c] = WRONG
        }

        return agr
      }, {}),
    })

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
  word: PropTypes.string,
  goToScene: PropTypes.func,
}

export default GameRegular
