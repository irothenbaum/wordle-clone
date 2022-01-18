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
const Types = require('../../helpers/VersusEvents/Types')

const ROUND_MENU = 0
const ROUND_WAITING = 1
const ROUND_START = 2
const ROUND_WORDLE = 3
const ROUND_WORDLE_RESULTS = 4
const ROUND_REVERSE = 5
const ROUND_REVERSE_RESULTS = 6
const ROUND_GAME_OVER = 7

function GameVersus(props) {
  const socket = useRef(new VersusClient()).current
  const [round, setRound] = useState(ROUND_MENU)
  const [connectCode, setConnectCode] = useState(null)
  const [secretWord, setSecretWord] = useState(null)
  const [reverseStatuses, setReverseStatuses] = useState([])
  const [myFinalScore, setMyFinalScore] = useState(null)
  const [opponentFinalScore, setOpponentFinalScore] = useState(null)

  useEffect(() => {
    socket.on(Types.CONNECTION.WAITING, ev => {
      console.log('WAITING EVENT ', ev)
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
        setReverseStatuses(
          ev.guesses.reduce((agr, guess) => {
            agr.push(determineGuessResults(guess, secretWord))
          }, []),
        )
      })
    }
  }, [secretWord])

  const handleHostStartGame = () => {
    // TODO: words of different lengths
    props.socket.startGame(getWordOfLength(5))
  }

  const handleReverseGameOver = points => {
    setMyFinalScore(points)
    props.socket.markReverseComplete(points)

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
          <VersusRegular secretWord={secretWord} socket={socket} onComplete={() => setRound(ROUND_WORDLE_RESULTS)} />
        )

      case ROUND_WORDLE_RESULTS:
        return <VersusRegularResults isWaiting={reverseStatuses.length === 0} onReady={setRound(ROUND_REVERSE)} />

      case ROUND_REVERSE:
        return <VersusReverse finalWord={secretWord} patterns={reverseStatuses} onGameOver={handleReverseGameOver} />

      case ROUND_REVERSE_RESULTS:
        return <VersusReverseWaiting socket={socket} />

      case ROUND_GAME_OVER:
        return <VersusGameOver myPoints={myFinalScore} opponentPoints={opponentFinalScore} />
    }
  }

  return <div className="GameVersus">{getComponentForRound()}</div>
}

export default GameVersus
