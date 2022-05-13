import {Event} from 'websocket-client'
const Types = require('./Types')

class GameWordleCompleteEvent extends Event {
  /**
   * @param {Array<Array<string>>} boardState
   */
  constructor(boardState) {
    super(Types.GAME.WORDLE_COMPLETE)
    this.boardState = boardState
  }
}

export default GameWordleCompleteEvent
