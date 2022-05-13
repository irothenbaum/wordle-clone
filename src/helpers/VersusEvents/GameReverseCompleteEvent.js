import {Event} from 'websocket-client'
import Types from './Types'

class GameReverseCompleteEvent extends Event {
  constructor(points) {
    super(Types.GAME.REVERSE_COMPLETE)
    this.points = points
  }
}

export default GameReverseCompleteEvent
