import {Event} from 'websocket-client'
import Types from './Types'

class GamePlayerReadyEvent extends Event {
  constructor(status) {
    super(Types.GAME.READY_STATUS)
    this.status = status
  }
}

export default GamePlayerReadyEvent
