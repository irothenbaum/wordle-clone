import HeartbeatSocket from './HeartbeatSocket'
import SimpleObservable from './SimpleObservable'
const Types = require('./VersusEvents/Types')
import ConnectionInitEvent from './VersusEvents/ConnectionInitEvent'
import ConnectionWaitingEvent from './VersusEvents/ConnectionWaitingEvent'
import ConnectionReadyEvent from './VersusEvents/ConnectionReadyEvent'
import GamePlayerReadyEvent from './VersusEvents/GamePlayerReadyEvent'
import GameStartEvent from './VersusEvents/GameStartEvent'
import GameWordleCompleteEvent from './VersusEvents/GameWordleCompleteEvent'
import GameReverseCompleteEvent from './VersusEvents/GameReverseCompleteEvent'

class VersusClient extends SimpleObservable {
  constructor() {
    super()

    this.__handleDataMessage = this.__handleDataMessage.bind(this)
  }

  /**
   * @param {string?} code
   * @return {Promise<void>}
   */
  async init(code) {
    await this.close()

    let endpoint = code ? `/game/${code}/join` : '/game/create'
    const url = window.location.origin.replace('http', 'ws') + endpoint
    this.__connection = new HeartbeatSocket(url, Types.CONNECTION.HEARTBEAT)
    this.__connection.on(HeartbeatSocket.EVENT_MESSAGE_RECEIVED, this.__handleDataMessage)
    this.__connection.on(HeartbeatSocket.EVENT_CONNECTION_ERROR, error => {
      console.error(error)
    })
    this.__connection.on(HeartbeatSocket.EVENT_CONNECTION_CLOSED, () => {
      console.log('CONNECTION CLOSED')
    })
    const initEvent = new ConnectionInitEvent(code)
    this.__connection.send(Types.CONNECTION.INIT, initEvent)
    this.trigger(Types.CONNECTION.INIT, initEvent)
  }

  async close() {
    if (this.__connection) {
      this.__connection.close()
      this.trigger(Types.CONNECTION.CLOSE)
    }
  }

  /**
   * @param {boolean} status
   */
  markPlayerReady(status) {
    let eventInstance = new GamePlayerReadyEvent(status)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /**
   * @param {string} secretWord
   */
  startGame(secretWord) {
    let eventInstance = new GameStartEvent(secretWord)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /**
   * @param {boolean} didSolve
   * @param {Array<string>} guesses
   */
  markWordleComplete(didSolve, guesses) {
    let eventInstance = new GameWordleCompleteEvent(didSolve, guesses)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /**
   * @param {Array<Array<number>>} points
   */
  markReverseComplete(points) {
    let eventInstance = new GameReverseCompleteEvent(points)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /**
   * @private
   * @param {DataMessage} dataMessage
   */
  __handleDataMessage(dataMessage) {
    let event

    // build the correct event object given the type
    switch (dataMessage.type) {
      // -------------------------------------------------------------
      case Types.GAME.READY_STATUS:
        event = new GamePlayerReadyEvent(dataMessage.payload.status)
        break

      case Types.GAME.START:
        event = new GameStartEvent(dataMessage.payload.secretWord)
        break

      case Types.GAME.WORDLE_COMPLETE:
        event = new GameWordleCompleteEvent(dataMessage.payload.didSolve, dataMessage.payload.guesses)
        break

      case Types.GAME.REVERSE_COMPLETE:
        event = new GameReverseCompleteEvent(dataMessage.payload.points)
        break

      // -------------------------------------------------------------
      case Types.CONNECTION.WAITING:
        event = new ConnectionWaitingEvent(dataMessage.payload.connectCode)
        break

      case Types.CONNECTION.INIT:
        event = new ConnectionInitEvent(dataMessage.payload.connectCode)
        break

      case Types.CONNECTION.HEARTBEAT:
        // do nothing
        break

      case Types.CONNECTION.READY:
        event = new ConnectionReadyEvent()
        break

      default:
        console.log('Unrecognized Event Type: ' + dataMessage.type)
    }

    if (event) {
      event.timestamp = dataMessage.timestampSent
      // broadcast the event
      this.trigger(dataMessage.type, event)
    }
  }
}

export default VersusClient
