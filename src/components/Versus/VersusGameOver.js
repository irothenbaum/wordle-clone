import PropTypes from 'prop-types'

function calculateFinalScore(pointsArr) {
  return pointsArr.reduce((sum, arr) => {
    return (
      sum +
      arr.reduce((s, p) => {
        return s + p
      }, 0)
    )
  }, 0)
}

function VersusGameOver(props) {
  const myScore = calculateFinalScore(props.myPoints)
  const opponentScore = calculateFinalScore(props.opponentPoints)

  return (
    <div>
      <h1>Game Over!</h1>

      <p>Your score {myScore}</p>
      <p>Opponent score {opponentScore}</p>

      <h1>{myScore > opponentScore ? 'You win!' : myScore < opponentScore ? 'You lost' : 'Tie game!'}</h1>
    </div>
  )
}

VersusGameOver.propTypes = {
  myPoints: PropTypes.array,
  opponentPoints: PropTypes.array,
}

export default VersusGameOver
