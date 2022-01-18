import Event from './Event'
const Types = require('./Types')

class GameReverseCompleteEvent extends Event {
  constructor(points) {
    super(Types.GAME.REVERSE_COMPLETE)
    this.points = points
  }
}

export default GameReverseCompleteEvent
