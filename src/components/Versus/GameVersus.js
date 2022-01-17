import './GameVersus.css'
import {useEffect, useRef, useState} from 'react'
import VersusMenu from './VersusMenu'
import VersusClient from '../../helpers/VersusClient'
const Types = require('../../helpers/VersusEvents/Types')

const ROUND_MENU = 0
const ROUND_WAITING = 1
const ROUND_START = 2
const ROUND_WORDLE = 3
const ROUND_WORLDE_END = 4
const ROUND_REVERSE = 5
const ROUND_GAME_OVER = 6

function GameVersus(props) {
  const socket = useRef(new VersusClient()).current
  const [round, setRound] = useState(ROUND_MENU)

  useEffect(() => {
    socket.on(Types.CONNECTION.WAITING, () => setRound(ROUND_WAITING))
    socket.on(Types.CONNECTION.READY, () => setRound(ROUND_START))

    return () => {
      socket.close().catch(err => console.error(err))
    }
  }, [])

  const getComponentForRound = () => {
    switch (round) {
      case ROUND_MENU:
        return <VersusMenu socket={setSocket} />

      case ROUND_WAITING:
        return <VersusWaiting />
    }
  }

  return <div className="GameVersus">{getComponentForRound()}</div>
}

export default GameVersus
