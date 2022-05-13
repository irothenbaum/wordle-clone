import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Types from '../../helpers/VersusEvents/Types'

function VersusStartInstructions(props) {
  const [isReady, setIsReady] = useState(false)
  const [opponentReady, setOpponentReady] = useState(false)

  useEffect(() => {
    const handler = props.socket.on(Types.GAME.READY_STATUS, e => {
      setOpponentReady(e.status)
    })
    return () => {
      props.socket.off(handler)
    }
  }, [])

  useEffect(() => {
    if (isReady && opponentReady) {
      props.socket.on()
    }
  }, [isReady, opponentReady])

  const handleReadyButton = () => {
    let ready = !isReady
    setIsReady(ready)
    props.socket.markPlayerReady(ready)
  }

  return (
    <div className="VersusInstructions">
      <h1>Instructions</h1>
      <p>Blah blah blah, here's how to play</p>

      <hr />

      {props.isHost ? (
        opponentReady ? (
          <button onClick={props.onStart}>Start game</button>
        ) : (
          <p>Waiting for opponent to ready up...</p>
        )
      ) : isReady ? (
        <p>Waiting for host to start game...</p>
      ) : (
        <button onClick={handleReadyButton}>{'Ready!'}</button>
      )}
    </div>
  )
}

VersusStartInstructions.propTypes = {
  socket: PropTypes.any,
  isHost: PropTypes.bool,
  onStart: PropTypes.func,
}

export default VersusStartInstructions
