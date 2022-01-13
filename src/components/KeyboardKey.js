import './KeyboardKey.css'
import PropTypes from 'prop-types'

function KeyboardKey(props) {
  const handleClick = () => {
    if (props.isDisabled) {
      return
    }

    props.onClick(props.char)
  }
  return (
    <div className={`KeyboardKey ${props.status} ${props.isDisabled ? 'disabled' : ''}`} onClick={handleClick}>
      {props.char === KeyboardKey.KEY_DELETE ? '<' : props.char === KeyboardKey.KEY_SUBMIT ? '^' : props.char}
    </div>
  )
}

KeyboardKey.KEY_DELETE = 'delete'
KeyboardKey.KEY_SUBMIT = 'submit'

KeyboardKey.propTypes = {
  char: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  status: PropTypes.string,
}

export default KeyboardKey
