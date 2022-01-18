import './VersusMenu.css'
import {useState} from 'react'
import PropTypes from 'prop-types'

const CODE_LENGTH = 6

function VersusMenu(props) {
  // const [wordLength, setWordLength] = useState(null)
  const [joinCode, setJoinCode] = useState('')

  const handleStartNewGame = () => {
    // TODO: allow different word lengths
    props.socket.init().catch(props.onError)
  }

  const handleJoinGame = () => {
    props.socket.init(joinCode).catch(props.onError)
  }

  return (
    <div className="VersusMenu">
      <h1>WordVersus</h1>
      <fieldset>
        <h4>Start a new game:</h4>
        {/*<WordLengthOptions value={wordLength} onChange={setWordLength} />*/}
        <button onClick={handleStartNewGame}>Start</button>
      </fieldset>
      <hr />
      OR
      <hr />
      <fieldset>
        <h4>Join a friend's game:</h4>
        <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
        <button onClick={handleJoinGame} disabled={joinCode.length !== CODE_LENGTH}>
          Join
        </button>
      </fieldset>
    </div>
  )
}

VersusMenu.propTypes = {
  socket: PropTypes.any.isRequired,
  onError: PropTypes.func,
}

export default VersusMenu
