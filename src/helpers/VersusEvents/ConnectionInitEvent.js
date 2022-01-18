import Event from './Event'
const Types = require('./Types')

class ConnectionInitEvent extends Event {
  /**
   * @param {string} code
   * @param {string?} secretWord
   */
  constructor(code, secretWord) {
    super(Types.CONNECTION.INIT)

    this.code = code
    this.secretWord = secretWord
  }
}

export default ConnectionInitEvent
