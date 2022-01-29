import PropTypes from 'prop-types'
import VersusWaitingScreen from './VersusWaitingScreen'

function VersusReverseWaiting({isWaiting, onReady}) {
  return (
    <VersusWaitingScreen
      isWaiting={isWaiting}
      onReady={onReady}
      title={'Well done!'}
      waitingMessage={'Waiting for your opponent to finish (so slow)'}
      startingMessage={'The moment of truth...'}
    />
  )
}

VersusReverseWaiting.propTypes = {
  isWaiting: PropTypes.bool,
  onReady: PropTypes.func,
}

export default VersusReverseWaiting
