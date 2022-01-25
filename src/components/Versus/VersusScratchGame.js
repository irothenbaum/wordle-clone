import PropTypes from 'prop-types'

function VersusScratchGame({iScratched, opponentScratched}) {
  const message = iScratched
    ? opponentScratched
      ? 'You both guessed it on the first try! Tie Game!'
      : 'You guessed it on the first try. You Win!'
    : 'Your opponent guessed it on the first try. You Lose!'

  return <div className="VersusScratchGame">{message}</div>
}

VersusScratchGame.propTypes = {
  iScratched: PropTypes.bool.isRequired,
  opponentScratched: PropTypes.bool.isRequired,
}

export default VersusScratchGame
