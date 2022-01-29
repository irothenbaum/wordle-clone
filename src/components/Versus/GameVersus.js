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
import {getSolvedAndScratchedFromBoardState, getWordOfLength} from '../../lib/utilities'
import VersusReverseWaiting from './VersusReverseWaiting'
import VersusScratchGame from './VersusScratchGame'
import {CORRECT, SCENE_MENU} from '../../lib/constants'
const Types = require('../../helpers/VersusEvents/Types')

const ROUND_MENU = 0
const ROUND_WAITING = 1
const ROUND_START = 2
const ROUND_WORDLE = 3
const ROUND_WORDLE_RESULTS = 4
const ROUND_REVERSE = 5
const ROUND_REVERSE_RESULTS = 6
const ROUND_GAME_OVER = 7
const ROUND_SCRATCH = 8

function GameVersus(props) {
  const socket = useRef(new VersusClient()).current
  const [round, setRound] = useState(ROUND_MENU)
  const [connectCode, setConnectCode] = useState(null)
  const [secretWord, setSecretWord] = useState(null)
  const [reverseStatuses, setReverseStatuses] = useState([])
  const [isHost, setIsHost] = useState(null)

  // starting as NULL so we can typecheck boolean
  const [opponentScratched, setOpponentScratched] = useState(null)
  const [opponentSolvedSecretWord, setOpponentSolvedSecretWord] = useState(null)
  const [opponentPoints, setOpponentPoints] = useState(null)
  const [iScratched, setIScratched] = useState(null)
  const [iSolvedSecretWord, setISolvedSecretWord] = useState(null)
  const [myPoints, setMyPoints] = useState(null)

  useEffect(() => {
    socket.on(Types.CONNECTION.WAITING, ev => {
      setConnectCode(ev.connectCode)
      setIsHost(true)
      setRound(ROUND_WAITING)
    })

    socket.on(Types.CONNECTION.READY, ev => {
      setRound(ROUND_START)
    })

    socket.on(Types.GAME.START, ev => {
      setSecretWord(ev.secretWord)
      setRound(ROUND_WORDLE)
    })

    socket.on(Types.GAME.REVERSE_COMPLETE, ev => {
      setOpponentPoints(ev.points)
    })

    return () => {
      socket.close().catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    if (secretWord) {
      socket.on(Types.GAME.WORDLE_COMPLETE, ev => {
        setReverseStatuses(ev.boardState)
        let [didSolve, didScratch] = getSolvedAndScratchedFromBoardState(ev.boardState)
        setOpponentSolvedSecretWord(didSolve)
        setOpponentScratched(didScratch)
      })
    }
  }, [secretWord])

  useEffect(() => {
    // we only want to do this if we know for sure whether both did or do not scratch
    if (typeof iScratched !== 'boolean' || typeof opponentScratched !== 'boolean') {
      return
    }

    if (iScratched || opponentScratched) {
      setRound(ROUND_SCRATCH)
    }
  }, [iScratched, opponentScratched])

  const getComponentForRound = () => {
    switch (round) {
      case ROUND_MENU:
        return <VersusMenu socket={socket} />

      case ROUND_WAITING:
        return <VersusWaiting gameCode={connectCode} />

      case ROUND_START:
        return (
          <VersusStartInstructions
            onStart={() => {
              // TODO: words of different lengths
              const secretWord = getWordOfLength(5)
              socket.startGame(secretWord)
              setSecretWord(secretWord)
              setRound(ROUND_WORDLE)
            }}
            socket={socket}
            isHost={isHost}
          />
        )

      case ROUND_WORDLE:
        return (
          <VersusRegular
            secretWord={secretWord}
            socket={socket}
            onComplete={boardState => {
              let [didSolve, didScratch] = getSolvedAndScratchedFromBoardState(boardState)
              setISolvedSecretWord(didSolve)
              setIScratched(didScratch)
              setRound(ROUND_WORDLE_RESULTS)
              socket.markWordleComplete(boardState)
            }}
          />
        )

      case ROUND_WORDLE_RESULTS:
        return (
          <VersusRegularResults
            isWaiting={typeof opponentSolvedSecretWord !== 'boolean'}
            onReady={() => setRound(ROUND_REVERSE)}
          />
        )

      case ROUND_REVERSE:
        return (
          <VersusReverse
            finalWord={secretWord}
            patterns={reverseStatuses}
            onGameOver={points => {
              setMyPoints(points)
              socket.markReverseComplete(points)
              setRound(ROUND_REVERSE_RESULTS)
            }}
          />
        )

      case ROUND_REVERSE_RESULTS:
        return (
          <VersusReverseWaiting
            onReady={() => {
              setRound(ROUND_GAME_OVER)
            }}
            isWaiting={!Array.isArray(opponentPoints)}
          />
        )

      case ROUND_GAME_OVER:
        return <VersusGameOver myPoints={myPoints} opponentPoints={opponentPoints} />

      case ROUND_SCRATCH:
        return <VersusScratchGame opponentScratched={opponentScratched} iScratched={iScratched} />
    }
  }

  const isTerminatedState = [ROUND_GAME_OVER, ROUND_SCRATCH].includes(round)
  console.log({
    round,
    iScratched,
    opponentScratched,
    reverseStatuses,
    isTerminatedState,
  })

  return (
    <div className="GameVersus">
      {getComponentForRound()}
      {isTerminatedState && (
        <div>
          <button onClick={() => props.goToScene(SCENE_MENU)}>Back to Menu</button>
        </div>
      )}
    </div>
  )
}

export default GameVersus
