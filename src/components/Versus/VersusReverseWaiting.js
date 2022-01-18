import PropTypes from 'prop-types'
import {useEffect} from 'react'
import Types from '../../helpers/VersusEvents/Types'

function VersusReverseWaiting({socket, onReady}) {
  useEffect(() => {
    const handler = socket.on(Types.GAME.REVERSE_COMPLETE, ev => {
      onReady(ev.payload.points)
    })
    return () => {
      socket.off(handler)
    }
  }, [])

  return <div>Waiting for opponent...</div>
}

VersusReverseWaiting.propTypes = {
  socket: PropTypes.any,
  onReady: PropTypes.func,
}

export default VersusReverseWaiting
