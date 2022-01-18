import Event from './Event'
const Types = require('./Types')

class GamePlayerReadyEvent extends Event {
  constructor(status) {
    super(Types.GAME.READY_STATUS)
    this.status = status
  }
}

export default GamePlayerReadyEvent
