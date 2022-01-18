import Event from './Event'
const Types = require('./Types')

class GameWordleCompleteEvent extends Event {
  /**
   * @param {boolean} didSolve
   * @param {Array<string>} guesses
   */
  constructor(didSolve, guesses) {
    super(Types.GAME.WORDLE_COMPLETE)
    this.didSolve = didSolve
    this.guesses = guesses
  }
}

export default GameWordleCompleteEvent
