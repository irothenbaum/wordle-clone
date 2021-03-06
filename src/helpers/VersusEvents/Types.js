import {Types} from 'websocket-client'

const VersusTypes = {
  GAME: {
    READY_STATUS: 'game:ready-status',
    START: 'game:start',
    WORDLE_COMPLETE: 'game:wordle-complete',
    START_REVERSE: 'game:start-reverse',
    REVERSE_COMPLETE: 'game:reverse-complete',
  },
  CONNECTION: Types.CONNECTION,
}

export default VersusTypes
