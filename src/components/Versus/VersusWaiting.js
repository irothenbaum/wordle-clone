import './VersusWaiting.css'
import PropTypes from 'prop-types'

function VersusWaiting(props) {
  return <div className="VersusWaiting">Waiting for opponent. Use code {props.gameCode}</div>
}

VersusWaiting.propTypes = {
  gameCode: PropTypes.string,
}

export default VersusWaiting
