import {determineGuessResults} from '../lib/utilities'
import {ALMOST, CORRECT, WRONG} from '../lib/constants'
import {useState} from 'react'

function useKeyboardLetterStates() {
  const [letterStates, setLetterStates] = useState({})

  const applyGuess = (userGuess, secretWord) => {
    // in this case, we need to feed the results into the keyboard state
    const results = determineGuessResults(userGuess, secretWord)
    setLetterStates({
      ...letterStates,
      ...userGuess.split('').reduce((agr, c, index) => {
        // letterStates will always hold the best guess result for every character
        // the best status could come from 3 possible values:
        // 1. The best status from a previous guess (letterStates)
        // 2. This current character's status in this guess (results)
        // 3. A previous letter of the same character in this guess's status (agr)
        let possibleStatuses = [letterStates[c], results[index], agr[c]]

        // if any are Correct, then the best status is Correct. Otherwise, if any are Almost, then the best status is Almost
        if (possibleStatuses.includes(CORRECT)) {
          agr[c] = CORRECT
        } else if (possibleStatuses.includes(ALMOST)) {
          agr[c] = ALMOST
        } else {
          agr[c] = WRONG
        }

        return agr
      }, {}),
    })
  }

  return {
    letterStates,
    applyGuess,
  }
}

export default useKeyboardLetterStates
