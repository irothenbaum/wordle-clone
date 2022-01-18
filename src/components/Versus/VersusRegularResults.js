import {useEffect} from 'react'
import PropTypes from 'prop-types'

function VersusRegularResults({onReady, isWaiting}) {
  useEffect(() => {
    if (isWaiting) {
      setTimeout(onReady, 5000)
    }
  }, [isWaiting])

  return (
    <div>
      <h1>Round 1 Complete.</h1>

      {isWaiting ? (
        <div>Waiting for your opponent to finish. Enjoy your quicker wit...</div>
      ) : (
        <div>You both did great. Now starting round 2...</div>
      )}
    </div>
  )
}

VersusRegularResults.propTypes = {
  onReady: PropTypes.func,
  isWaiting: PropTypes.bool,
}

export default VersusRegularResults
