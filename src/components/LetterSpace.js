import './LetterSpace.css'
import PropTypes from 'prop-types'
import {ALMOST, CORRECT, WRONG} from '../lib/constants'

function LetterSpace(props) {
  const status = props.status || LetterSpace.STATUS_NULL

  return (
    <div className={`LetterSpace ${status} ${props.isFlipped ? 'flipped' : ''}`}>
      <div className="Card CardFront">{props.points || props.letter}</div>
      <div className="Card CardBack">{props.letter}</div>
    </div>
  )
}

LetterSpace.STATUS_NULL = 'null'
LetterSpace.STATUS_WRONG = WRONG
LetterSpace.STATUS_ALMOST = ALMOST
LetterSpace.STATUS_CORRECT = CORRECT

LetterSpace.propTypes = {
  letter: PropTypes.string,
  status: PropTypes.string,
  isFlipped: PropTypes.bool,
  points: PropTypes.number,
}

export default LetterSpace
