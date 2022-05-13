import {Event} from 'websocket-client'
import Types from './Types'

class GameStartEvent extends Event {
  constructor(secretWord) {
    super(Types.GAME.START)
    this.secretWord = secretWord
  }
}

export default GameStartEvent
