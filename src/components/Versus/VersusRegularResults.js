import PropTypes from 'prop-types'
import VersusWaitingScreen from './VersusWaitingScreen'

function VersusRegularResults({onReady, isWaiting}) {
  return (
    <VersusWaitingScreen
      isWaiting={isWaiting}
      onReady={onReady}
      title={'Round 1 Complete'}
      waitingMessage={'Waiting for your opponent to finish. Enjoy your quicker wit...'}
      startingMessage={'You both did great. Now starting round 2...'}
    />
  )
}

VersusRegularResults.propTypes = {
  isWaiting: PropTypes.bool,
  onReady: PropTypes.func,
}

export default VersusRegularResults
