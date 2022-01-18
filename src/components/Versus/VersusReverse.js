import './VersusReverse.css'
import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import useQuickRevertBoolean from '../../hooks/useQuickRevertBoolean'
import {getPointsForGuessReverse} from '../../lib/utilities'
import WordRowReversed from '../WordRowReversed'
import {CORRECT, SCENE_MENU} from '../../lib/constants'
import Keyboard from '../Keyboard'

function VersusReverse({finalWord, patterns, onGameOver}) {
  const [previousGuesses, setPreviousGuesses] = useState([])
  const [userGuess, setUserGuess] = useState('')
  const [points, setPoints] = useState([])
  const {status: shouldShake, toggleOn: setShouldShake} = useQuickRevertBoolean()
  const [misMatchPositions, setMisMatchPositions] = useState([])

  useEffect(() => {
    if (previousGuesses.length === patterns.length) {
      onGameOver(points)
    }
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
      setShouldShake()
      setMisMatchPositions(err.mismatchPositions)
    }
  }

  const handleRevealPointsComplete = () => {
    setPreviousGuesses([...previousGuesses, userGuess])
    setUserGuess('')
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
            shakePattern={isFocused && shouldShake ? misMatchPositions : []}
            showResults={isFocused && index === points.length - 1}
            onRevealed={handleRevealPointsComplete}
          />
        )
      })}

      <WordRowReversed word={finalWord} isShaking={shouldShake} statusPattern={[...finalWord].map(char => CORRECT)} />

      <Keyboard
        value={userGuess}
        onChange={setUserGuess}
        onComplete={handleGuess}
        isFull={userGuess.length === finalWord.length}
        isDisabled={false}
        letterStates={{}}
      />
    </div>
  )
}

VersusReverse.propTypes = {
  finalWord: PropTypes.string,
  patterns: PropTypes.array,
  onGameOver: PropTypes.array,
}

export default VersusReverse
