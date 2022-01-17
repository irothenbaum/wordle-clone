import './GameOverResults.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

function GameOverResultsReverse(props) {
  const handleShare = () => {
    console.log('SHARE')
  }

  return (
    <div className="GameOverResults">
      <div className="GameOverResultsInner">
        <h3>Well done!</h3>
        <p>Your scored {props.score} points.</p>

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

GameOverResultsReverse.propTypes = {
  score: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default GameOverResultsReverse
