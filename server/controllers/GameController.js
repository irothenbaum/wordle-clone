const SocketHelper = require('../helpers/SocketHelper')
const DataMessage = require('../../src/helpers/DataMessage')
const CODE_LENGTH = 6
const ROLE_OPPONENT = 'role-opponent'
const ROLE_HOST = 'role-host'
const Types = require('../../src/helpers/VersusEvents/Types')

/**
 * @param {number?} length
 * @returns {string}
 */
const randomCharacters = length => {
  Math.random().toString(36).substr(2, length)
}

class GameController {
  /**
   * @param {WebSocket} socket
   * @param {*} req
   * @return {Promise<void>}
   */
  static async socketCreateGame(socket, req) {
    let connectCode
    // generate a new code
    let tooManyCount = 10
    do {
      connectCode = randomCharacters(CODE_LENGTH)

      if (tooManyCount-- < 0) {
        throw new Error('Could not generate a unique code')
      }
    } while (!SocketHelper.getActiveSocketByCode(req.params.code, ROLE_HOST))

    // mark this socket
    SocketHelper.markSocketWithCode(socket, connectCode, ROLE_HOST, req.params.secretWord)

    // configure our server side handling
    SocketHelper.configureSocket(socket)

    // notify the game we're waiting for a controller to connect
    let successMessage = DataMessage.toSend(Types.CONNECTION.WAITING, {
      connectCode: connectCode,
    })

    SocketHelper.pushToSocket(socket, successMessage)
  }

  /**
   * @param {WebSocket} socket
   * @param {*} req
   * @return {Promise<void>}
   */
  static async socketJoinGame(socket, req) {
    let connectCode = req.params.code

    // make sure this code isn't already in use
    let activeOpponent = SocketHelper.getActiveSocketByCode(connectCode, ROLE_OPPONENT)
    if (activeOpponent) {
      throw new Error('Game already played')
    }

    let activeGame = SocketHelper.getActiveSocketByCode(connectCode, ROLE_HOST)
    if (!activeGame) {
      throw new Error('No game found')
    }

    // mark this socket
    SocketHelper.markSocketWithCode(socket, connectCode, ROLE_OPPONENT)

    // configure our server side handling
    SocketHelper.configureSocket(socket)

    // connect them
    initiateHandshake(activeGame, socket)
  }
}

/**
 * @param {WebSocket} hostSocket
 * @param {WebSocket} opponentSocket
 */
function initiateHandshake(hostSocket, opponentSocket) {
  SocketHelper.markSocketsAsConnected(hostSocket, opponentSocket)

  // send them both a ready event
  let readyMessage = DataMessage.toSend(Types.CONNECTION.READY, {
    secretWord: hostSocket._meta.secretWord,
  })
  SocketHelper.pushToSocket(opponentSocket, readyMessage)
  SocketHelper.pushToSocket(hostSocket, readyMessage)
}

module.exports = GameController
