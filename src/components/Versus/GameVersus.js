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
import {determineGuessResults, getWordOfLength} from '../../lib/utilities'
import VersusReverseWaiting from './VersusReverseWaiting'
import VersusScratchGame from './VersusScratchGame'
import {SCENE_MENU} from '../../lib/constants'
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
  const [myFinalScore, setMyFinalScore] = useState(null)
  const [opponentFinalScore, setOpponentFinalScore] = useState(null)

  // starting as NULL so we can typecheck boolean
  const [opponentScratched, setOpponentScratched] = useState(null)
  const [iScratched, setIScratched] = useState(null)

  useEffect(() => {
    socket.on(Types.CONNECTION.WAITING, ev => {
      setConnectCode(ev.connectCode)
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
      setOpponentFinalScore(ev.points)
    })

    return () => {
      socket.close().catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    if (secretWord) {
      socket.on(Types.GAME.WORDLE_COMPLETE, ev => {
        if (ev.guesses.length === 0) {
          setOpponentScratched(true)
        } else {
          setOpponentScratched(false)
          setReverseStatuses(
            ev.guesses.reduce((agr, guess) => {
              agr.push(determineGuessResults(guess, secretWord))
              return agr
            }, []),
          )
        }
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

  const handleHostStartGame = () => {
    // TODO: words of different lengths
    const secretWord = getWordOfLength(5)
    socket.startGame(secretWord)
    setSecretWord(secretWord)
    setRound(ROUND_WORDLE)
  }

  const handleReverseGameOver = points => {
    setMyFinalScore(points)
    socket.markReverseComplete(points)

    if (opponentFinalScore) {
      setRound(ROUND_GAME_OVER)
    } else {
      setRound(ROUND_REVERSE_RESULTS)
    }
  }

  const getComponentForRound = () => {
    switch (round) {
      case ROUND_MENU:
        return <VersusMenu socket={socket} />

      case ROUND_WAITING:
        return <VersusWaiting gameCode={connectCode} />

      case ROUND_START:
        // only the host has a connectCode state value
        return <VersusStartInstructions onStart={handleHostStartGame} socket={socket} isHost={!!connectCode} />

      case ROUND_WORDLE:
        return (
          <VersusRegular
            secretWord={secretWord}
            socket={socket}
            onComplete={(didSolve, guesses) => {
              setIScratched(didSolve && guesses.length === 1)
              setRound(ROUND_REVERSE_RESULTS)
            }}
          />
        )

      case ROUND_WORDLE_RESULTS:
        return <VersusRegularResults isWaiting={reverseStatuses.length === 0} onReady={() => setRound(ROUND_REVERSE)} />

      case ROUND_REVERSE:
        return <VersusReverse finalWord={secretWord} patterns={reverseStatuses} onGameOver={handleReverseGameOver} />

      case ROUND_REVERSE_RESULTS:
        return <VersusReverseWaiting socket={socket} />

      case ROUND_GAME_OVER:
        return <VersusGameOver myPoints={myFinalScore} opponentPoints={opponentFinalScore} />

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
    myFinalScore,
    opponentFinalScore,
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
