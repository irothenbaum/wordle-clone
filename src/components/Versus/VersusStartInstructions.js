import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
const Types = require('../../helpers/VersusEvents/Types')

function VersusStartInstructions(props) {
  const [isReady, setIsReady] = useState(false)
  const [opponentReady, setOpponentReady] = useState(false)

  useEffect(() => {
    const handler = props.socket.on(Types.GAME.READY_STATUS, e => {
      setOpponentReady(e.payload.status)
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

      {!isReady && <p>Click to mark yourself ready</p>}
      <button className={isReady ? 'secondary' : ''} onClick={handleReadyButton}>
        {isReady ? 'Not-ready' : 'Ready!'}
      </button>

      {opponentReady ? <p>Opponent is ready</p> : <p>Waiting for opponent...</p>}
    </div>
  )
}

VersusStartInstructions.propTypes = {
  socket: PropTypes.any,
  onReady: PropTypes.func,
}

export default VersusStartInstructions
