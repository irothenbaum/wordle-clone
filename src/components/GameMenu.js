import './GameMenu.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {BOARD_ROWS, SCENE_GAME_REGULAR, SCENE_GAME_REVERSE} from '../lib/constants'

const MAX_NUMBER = 8
const MIN_NUMBER = 5
function GameMenu(props) {
  const [internalValue, setInternalValue] = useState(null)

  return (
    <div className="GameMenu">
      <h1>Wordle Clone</h1>
      <p>
        Inspired by{' '}
        <a target="_blank" href="https://www.powerlanguage.co.uk/">
          Josh Wardle
        </a>
        's, "Wordle"
      </p>
      <h3>Word Length</h3>
      <div onChange={e => setInternalValue(parseInt(e.target.value))}>
        {[...new Array(MAX_NUMBER - MIN_NUMBER + 1)].map((e, i) => {
          const number = i + MIN_NUMBER
          return (
            <div key={number} className="WordCountOptions">
              <label>
                <input name="word-length" type="radio" value={number} />
                {number}
              </label>
            </div>
          )
        })}
      </div>

      <button
        className="PlayButton"
        disabled={typeof internalValue !== 'number'}
        onClick={() => props.goToScene(SCENE_GAME_REGULAR, {wordLength: internalValue})}>
        Play
      </button>

      <button
        className="PlayButton"
        disabled={typeof internalValue !== 'number'}
        onClick={() => props.goToScene(SCENE_GAME_REVERSE, {wordLength: internalValue, numberOfRows: BOARD_ROWS})}>
        Play Reverse
      </button>
    </div>
  )
}

GameMenu.propTypes = {
  goToScene: PropTypes.func.isRequired,
}

export default GameMenu
