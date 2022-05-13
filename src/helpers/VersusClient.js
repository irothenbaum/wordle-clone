import Types from './VersusEvents/Types'
import GamePlayerReadyEvent from './VersusEvents/GamePlayerReadyEvent'
import GameStartEvent from './VersusEvents/GameStartEvent'
import GameWordleCompleteEvent from './VersusEvents/GameWordleCompleteEvent'
import GameReverseCompleteEvent from './VersusEvents/GameReverseCompleteEvent'
import {DefaultClient} from 'websocket-client'

class VersusClient extends DefaultClient {
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
   * @param {Array<Array<string>>} boardState
   */
  markWordleComplete(boardState) {
    let eventInstance = new GameWordleCompleteEvent(boardState)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /**
   * @param {Array<Array<number>>} points
   */
  markReverseComplete(points) {
    let eventInstance = new GameReverseCompleteEvent(points)
    this.__connection.send(eventInstance.type, eventInstance)
  }

  /** @inheritDoc */
  _getConnectURL(code) {
    const endpoint = code ? `/versus/${code}/join` : '/versus/create'
    return window.location.origin.replace('http', 'ws') + endpoint
  }

  /** @inheritDoc */
  _generateEventFromDataMessage(dataMessage) {
    // build the correct event object given the type
    switch (dataMessage.type) {
      // -------------------------------------------------------------
      case Types.GAME.READY_STATUS:
        return new GamePlayerReadyEvent(dataMessage.payload.status)

      case Types.GAME.START:
        return new GameStartEvent(dataMessage.payload.secretWord)

      case Types.GAME.WORDLE_COMPLETE:
        return new GameWordleCompleteEvent(dataMessage.payload.boardState)

      case Types.GAME.REVERSE_COMPLETE:
        return new GameReverseCompleteEvent(dataMessage.payload.points)
    }

    console.log('Unrecognized Event Type: ' + dataMessage.type)
    return null
  }
}

export default VersusClient
