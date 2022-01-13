import {WRONG, CORRECT, ALMOST} from './constants'

const words5 = require('./dictionaries/words5.json')
const words6 = require('./dictionaries/words6.json')
const words7 = require('./dictionaries/words7.json')
const words8 = require('./dictionaries/words8.json')

const dictionary = {
  words5,
  words6,
  words7,
  words8,
}

/**
 * @param {number} length
 * @return {string}
 */
export const getWordOfLength = length => {
  let words = dictionary[`words${length}`]
  return words[Math.floor(Math.random() * words.length)]
}

/**
 * @param {string} guessedWord
 * @param {string} secretWord
 * @return {*[]}
 */
export const determineGuessResults = (guessedWord, secretWord) => {
  let retVal = []

  // we want to count how many times each character appears this way for a word like "TEAL", if they guess "TEST"
  // it won't suggest the second 2 is "almost" because it will know there's only 1 T
  // we only count characters that are NOT correct so that a guess like "EERR" for word "TEST" won't show the first E as correct
  let memo = {}
  for (let i = 0; i < secretWord.length; i++) {
    let char = secretWord[i]
    if (typeof memo[char] !== 'number') {
      memo[char] = 0
    }

    if (char !== guessedWord[i]) {
      memo[char]++
    }
  }

  // now we loop through the guess and determine what's right
  for (let i = 0; i < guessedWord.length; i++) {
    let thisChar = guessedWord[i]
    let charExists = memo[thisChar] && memo[thisChar] > 0
    if (thisChar === secretWord[i]) {
      retVal.push(CORRECT)
    } else if (charExists) {
      // deduct this character from the count so we don't count it twice
      retVal.push(ALMOST)
      memo[thisChar]--
    } else {
      retVal.push(WRONG)
    }
  }

  return retVal
}
