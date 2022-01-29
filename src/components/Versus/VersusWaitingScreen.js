import {useEffect} from 'react'
import PropTypes from 'prop-types'

function VersusWaitingScreen({onReady, isWaiting, title, waitingMessage, startingMessage}) {
  useEffect(() => {
    if (!isWaiting) {
      setTimeout(onReady, 5000)
    }
  }, [isWaiting])

  return (
    <div>
      <h1>{title}</h1>

      {isWaiting ? <div>{waitingMessage}</div> : <div>{startingMessage}</div>}
    </div>
  )
}

VersusWaitingScreen.propTypes = {
  onReady: PropTypes.func,
  isWaiting: PropTypes.bool,
  title: PropTypes.string,
  waitingMessage: PropTypes.string,
  startingMessage: PropTypes.string,
}

export default VersusWaitingScreen
