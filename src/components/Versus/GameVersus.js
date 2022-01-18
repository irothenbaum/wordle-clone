import './GameVersus.css'
import {useEffect, useRef, useState} from 'react'
import VersusMenu from './VersusMenu'
import VersusClient from '../../helpers/VersusClient'
import VersusWaiting from './VersusWaiting'
import VersusStartInstructions from './VersusStartInstructions'
import VersusReverse from './VersusReverse'
import VersusRegular from './VersusRegular'
import VersusRegularResults from './VersusRegularResults'
import VersusGameOver from './VersusGameOver'
const Types = require('../../helpers/VersusEvents/Types')

const ROUND_MENU = 0
const ROUND_WAITING = 1
const ROUND_START = 2
const ROUND_WORDLE = 3
const ROUND_WORDLE_RESULTS = 4
const ROUND_REVERSE = 5
const ROUND_GAME_OVER = 6

function GameVersus(props) {
  const socket = useRef(new VersusClient()).current
  const [round, setRound] = useState(ROUND_MENU)
  const [connectCode, setConnectCode] = useState(null)
  const [secretWord, setSecretWord] = useState(null)

  useEffect(() => {
    socket.on(Types.CONNECTION.WAITING, data => {
      setConnectCode(data.payload.connectCode)
      setRound(ROUND_WAITING)
    })
    socket.on(Types.CONNECTION.READY, data => {
      setSecretWord(data.payload.secretWord)
      setRound(ROUND_START)
    })

    return () => {
      socket.close().catch(err => console.error(err))
    }
  }, [])

  const getComponentForRound = () => {
    switch (round) {
      case ROUND_MENU:
        return <VersusMenu socket={socket} />

      case ROUND_WAITING:
        return <VersusWaiting gameCode={connectCode} />

      case ROUND_START:
        return <VersusStartInstructions socket={socket} onReady={() => setRound(ROUND_WORDLE)} />

      case ROUND_WORDLE:
        return <VersusRegular secretWord={secretWord} />

      case ROUND_WORDLE_RESULTS:
        return <VersusRegularResults />

      case ROUND_REVERSE:
        return <VersusReverse />

      case ROUND_GAME_OVER:
        return <VersusGameOver />
    }
  }

  return <div className="GameVersus">{getComponentForRound()}</div>
}

export default GameVersus
