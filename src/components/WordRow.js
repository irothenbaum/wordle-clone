import PropTypes from 'prop-types'
import LetterSpace from './LetterSpace'

function WordRow(props) {
  return (
    <div className="WordRow">
      {props.secretWord.map((letter, index) => {
        let guessedLetter
        let status = LetterSpace.STATUS_NULL
        // we only show results for any letter IFF all letters are present
        if (props.word.length === props.secretWord.length) {
          guessedLetter = props.word[index]
          if (guessedLetter === letter) {
            status = LetterSpace.STATUS_CORRECT
          } else if (props.word.includes(guessedLetter)) {
            status = LetterSpace.STATUS_ALMOST
          }
        }

        return <LetterSpace letter={guessedLetter} status={status} />
      })}
    </div>
  )
}

WordRow.STATUS_BUILD = 'build'
WordRow.STATUS_REVEAL = 'reveal'

WordRow.propTypes = {
  word: PropTypes.string,
  secretWord: PropTypes.string,
}

export default WordRow
