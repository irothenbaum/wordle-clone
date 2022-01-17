import './GameOverResults.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

function GameOverResults(props) {
  const handleShare = () => {
    console.log('SHARE')
  }

  return (
    <div className="GameOverResults">
      <div className="GameOverResultsInner">
        <h3>{props.didWin ? 'Well done!' : 'Game Over'}</h3>
        {props.didWin ? (
          <p>
            You guessed the word in {props.guessesMade} / {props.possibleGuesses} guesses
          </p>
        ) : (
          <p>You didn't guess the secret word. It was {props.secretWord}</p>
        )}

        <div className="ButtonsContainer">
          <button className="secondary" onClick={props.onBack}>
            Back
          </button>
          <button className="primary" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

GameOverResults.propTypes = {
  didWin: PropTypes.bool.isRequired,
  guessesMade: PropTypes.number.isRequired,
  possibleGuesses: PropTypes.number.isRequired,
  secretWord: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default GameOverResults
