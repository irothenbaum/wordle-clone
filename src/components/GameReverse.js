import './GameReverse.css'
import PropTypes from 'prop-types'
import {useCallback, useState} from 'react'
import {useEffect} from 'react'
import Keyboard from './Keyboard'
import {getPointsForGuessReverse, getRandomPatternsFromWord, getWordOfLength} from '../lib/utilities'
import {ALMOST, CORRECT, WRONG, SCENE_MENU, BOARD_ROWS} from '../lib/constants'
import GameOverResults from './GameOverResults'
import WordRowReversed from './WordRowReversed'
import GameOverResultsReverse from './GameOverResultsReverse'

function GameRegular(props) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const [finalWord, setFinalWord] = useState('')
  const [patterns, setPatterns] = useState([])
  const [points, setPoints] = useState([])

  useEffect(() => {
    const word = getWordOfLength(props.wordLength)
    const p = getRandomPatternsFromWord(word, props.numberOfRows, true)

    setFinalWord(word)
    setPatterns(p)
    return () => {
      // do nothing
    }
  }, [])

  useEffect(() => {
    setIsGameOver(previousGuesses.length === props.numberOfRows - 1)
  }, [previousGuesses])

  const handleGuess = () => {
    if (userGuess.length < finalWord.length) {
      return
    }

    try {
      let pointsAwarded = getPointsForGuessReverse(userGuess, finalWord, patterns[previousGuesses.length])

      setPoints([...points, pointsAwarded])
    } catch (err) {
      // word does not match
      console.error(err)
    }
  }

  const handleRevealPointsComplete = () => {
    setPreviousGuesses([...previousGuesses, userGuess])
    setUserGuess('')
  }

  if (patterns.length === 0) {
    return null
  }

  return (
    <div className="GameReverse">
      {/* We do rows - 1 because the last row is always 100% correct */}
      {[...new Array(props.numberOfRows - 1)].map((e, index) => {
        const isFocused = index === previousGuesses.length
        const guessedWord = (isFocused ? userGuess : previousGuesses[index]) || ''

        return (
          <WordRowReversed
            key={`row-${index}-${guessedWord}`}
            statusPattern={patterns[index]}
            points={points[index]}
            word={guessedWord}
            isFocused={isFocused}
            showResults={isFocused && index === points.length - 1}
            onRevealed={handleRevealPointsComplete}
          />
        )
      })}

      <WordRowReversed word={finalWord} statusPattern={[...finalWord].map(char => CORRECT)} />

      <Keyboard
        value={userGuess}
        onChange={setUserGuess}
        onComplete={handleGuess}
        isFull={userGuess.length === finalWord.length}
        isDisabled={false}
        letterStates={{}}
      />

      {isGameOver ? (
        <GameOverResultsReverse
          score={points.reduce((sum, arr) => sum + arr.reduce((s, p) => s + p, 0), 0)}
          onBack={() => props.goToScene(SCENE_MENU)}
        />
      ) : null}
    </div>
  )
}

GameRegular.propTypes = {
  wordLength: PropTypes.number,
  numberOfRows: PropTypes.number,
  goToScene: PropTypes.func,
}

export default GameRegular
