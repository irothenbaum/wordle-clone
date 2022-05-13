import {Event} from 'websocket-client'
const Types = require('./Types')

class GameStartEvent extends Event {
  constructor(secretWord) {
    super(Types.GAME.START)
    this.secretWord = secretWord
  }
}

export default GameStartEvent
