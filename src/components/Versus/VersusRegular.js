import './VersusRegular.css'
import {useState, useEffect} from 'react'
import useKeyboardLetterStates from '../../hooks/useKeyboardLetterStates'
import useQuickRevertBoolean from '../../hooks/useQuickRevertBoolean'
import {BOARD_ROWS} from '../../lib/constants'
import PropTypes from 'prop-types'
import WordRow from '../WordRow'
import Keyboard from '../Keyboard'
import {determineGuessResults, isWordInDictionary} from '../../lib/utilities'
import BannerMessage from '../BannerMessage'
const Types = require('../../helpers/VersusEvents/Types')

function VersusRegular({secretWord, socket, onComplete}) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [showGuessResults, setShowGuessResults] = useState(false)
  const {letterStates, applyGuess} = useKeyboardLetterStates()
  const {status: shouldShake, toggleOn: setShouldShake} = useQuickRevertBoolean()
  const [isOpponentDone, setIsOpponentDone] = useState(false)

  useEffect(() => {
    const handler = socket.on(Types.GAME.WORDLE_COMPLETE, () => {
      setIsOpponentDone(true)
    })

    return () => {
      socket.off(handler)
    }
  }, [])

  const handleGuess = () => {
    if (userGuess.length < secretWord.length) {
      return
    }

    if (!isWordInDictionary(userGuess)) {
      setShouldShake()
      return
    }

    setShowGuessResults(true)
  }

  useEffect(() => {
    let lastGuess = previousGuesses[previousGuesses.length - 1]
    let boardState = previousGuesses.reduce((agr, guess) => {
      agr.push(determineGuessResults(guess, secretWord))
      return agr
    }, [])
    if (lastGuess === secretWord) {
      onComplete(boardState)
    } else if (previousGuesses.length === BOARD_ROWS) {
      onComplete(boardState)
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

  const rowsRemaining = BOARD_ROWS - previousGuesses.length - 1

  return (
    <div className="VersusRegular">
      {previousGuesses.map((prevGuess, index) => {
        return <WordRow isRevealed={true} key={`guess-${index}`} word={prevGuess} secretWord={secretWord} />
      })}
      {previousGuesses.length < BOARD_ROWS && (
        <WordRow
          showResults={showGuessResults}
          onRevealed={handleRevealGuessComplete}
          word={userGuess}
          secretWord={secretWord}
          isShaking={shouldShake}
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

      {isOpponentDone && (
        <BannerMessage message={'Your opponent just finished their board. Better hurry!'} duration={3000} />
      )}
    </div>
  )
}

VersusRegular.propTypes = {
  socket: PropTypes.any,
  secretWord: PropTypes.string,
  onComplete: PropTypes.func,
}

export default VersusRegular
