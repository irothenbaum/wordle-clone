import './Keyboard.css'
import React, {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import KeyboardKey from './KeyboardKey'
import useKeyListener from '../hooks/useKeyListener'

function Keyboard(props) {
  const handleKeyClick = useCallback(
    char => {
      if (props.isDisabled) {
        return
      }

      if (char === KeyboardKey.KEY_DELETE) {
        props.onChange(props.value.substr(0, props.value.length - 1))
      } else if (char === KeyboardKey.KEY_SUBMIT) {
        props.onComplete()
      } else if (!props.isFull) {
        props.onChange(props.value + char)
      }
    },
    [props.isFull, props.isDisabled, props.onChange, props.onComplete, props.value],
  )

  const handleKeyPress = useCallback(
    (char, code) => {
      switch (char) {
        case 'Backspace':
          handleKeyClick(KeyboardKey.KEY_DELETE)
          break

        case 'Enter':
          handleKeyClick(KeyboardKey.KEY_SUBMIT)
          break

        default:
          if (char && char.length === 1) {
            handleKeyClick(char.toLowerCase())
          }
      }
    },
    [handleKeyClick],
  )

  const {} = useKeyListener(handleKeyPress)

  const letterStates = props.letterStates || {}

  return (
    <div className="Keyboard">
      <div className="KeyboardRow">
        <KeyboardKey char={'q'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['q']} />
        <KeyboardKey char={'w'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['w']} />
        <KeyboardKey char={'e'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['e']} />
        <KeyboardKey char={'r'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['r']} />
        <KeyboardKey char={'t'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['t']} />
        <KeyboardKey char={'y'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['y']} />
        <KeyboardKey char={'u'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['u']} />
        <KeyboardKey char={'i'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['i']} />
        <KeyboardKey char={'o'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['o']} />
        <KeyboardKey char={'p'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['p']} />
      </div>
      <div className="KeyboardRow">
        <KeyboardKey char={'a'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['a']} />
        <KeyboardKey char={'s'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['s']} />
        <KeyboardKey char={'d'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['d']} />
        <KeyboardKey char={'f'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['f']} />
        <KeyboardKey char={'g'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['g']} />
        <KeyboardKey char={'h'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['h']} />
        <KeyboardKey char={'j'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['j']} />
        <KeyboardKey char={'k'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['k']} />
        <KeyboardKey char={'l'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['l']} />
      </div>
      <div className="KeyboardRow">
        <KeyboardKey char={KeyboardKey.KEY_DELETE} onClick={handleKeyClick} isDisabled={props.value.length === 0} />
        <KeyboardKey char={'z'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['z']} />
        <KeyboardKey char={'x'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['x']} />
        <KeyboardKey char={'c'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['c']} />
        <KeyboardKey char={'v'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['v']} />
        <KeyboardKey char={'b'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['b']} />
        <KeyboardKey char={'n'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['n']} />
        <KeyboardKey char={'m'} onClick={handleKeyClick} isDisabled={props.isFull} status={letterStates['m']} />
        <KeyboardKey char={KeyboardKey.KEY_SUBMIT} onClick={handleKeyClick} isDisabled={!props.isFull} />
      </div>
    </div>
  )
}

Keyboard.propTypes = {
  letterStates: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isFull: PropTypes.bool,
  onComplete: PropTypes.func,
  isDisabled: PropTypes.bool,
}

export default Keyboard
