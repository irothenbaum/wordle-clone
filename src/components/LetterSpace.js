import PropTypes from 'prop-types'

function LetterSpace(props) {
  const status = props.status || LetterSpace.STATUS_NULL

  return <div className={`LetterSpace ${status}`}>{props.letter}</div>
}

LetterSpace.STATUS_NULL = 'null'
LetterSpace.STATUS_ALMOST = 'almost'
LetterSpace.STATUS_CORRECT = 'correct'

LetterSpace.propTypes = {
  letter: PropTypes.string,
  status: PropTypes.string,
}

export default LetterSpace
